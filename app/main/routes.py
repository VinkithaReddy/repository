from flask import Blueprint, render_template, request, flash, redirect, url_for, send_file
from flask_login import login_required, current_user
from app.models import HealthRecord
from app import db, dropbox
from cryptography.fernet import Fernet
import os

main_bp = Blueprint('main', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@main_bp.route('/dashboard')
@login_required
def dashboard():
    records = HealthRecord.query.filter_by(user_id=current_user.id).all()
    return render_template('main/dashboard.html', records=records)

@main_bp.route('/upload', methods=['POST'])
@login_required
def upload_file():
    if 'file' not in request.files:
        flash('No file selected!', 'danger')
        return redirect(url_for('main.dashboard'))
        
    file = request.files['file']
    if file.filename == '':
        flash('No file selected!', 'danger')
        return redirect(url_for('main.dashboard'))
        
    if not allowed_file(file.filename):
        flash('Invalid file type!', 'danger')
        return redirect(url_for('main.dashboard'))
        
    if file and allowed_file(file.filename):
        # Encrypt file
        f = Fernet(current_app.config['ENCRYPTION_KEY'])
        encrypted_data = f.encrypt(file.read())
        
        # Upload to Dropbox
        dropbox_path = f'/phr/{current_user.id}/{file.filename}'
        dropbox.files_upload(encrypted_data, dropbox_path)
        
        # Save record to database
        record = HealthRecord(
            filename=file.filename,
            dropbox_path=dropbox_path,
            file_type=file.filename.rsplit('.', 1)[1].lower(),
            file_size=len(encrypted_data),
            user_id=current_user.id
        )
        db.session.add(record)
        db.session.commit()
        
        flash('File uploaded successfully!', 'success')
        return redirect(url_for('main.dashboard'))

