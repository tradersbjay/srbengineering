# EmailJS Template Code for Contact Form

## Template Settings in EmailJS Dashboard

When creating a new email template in EmailJS, use these settings:

### Template Content

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #1e5a96 0%, #0d3b7a 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 30px;
            color: #333333;
        }
        .field {
            margin-bottom: 20px;
            border-bottom: 1px solid #e5e5e5;
            padding-bottom: 15px;
        }
        .field:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #1e5a96;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .value {
            color: #555555;
            font-size: 14px;
            line-height: 1.6;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #999999;
            border-top: 1px solid #e5e5e5;
        }
        .company-info {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #e5e5e5;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Form Submission</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">S.R.B Engineering & Construction</p>
        </div>
        
        <div class="content">
            <div class="field">
                <div class="label">Full Name</div>
                <div class="value">{{full_name}}</div>
            </div>
            
            <div class="field">
                <div class="label">Phone Number</div>
                <div class="value">{{phone_number}}</div>
            </div>
            
            <div class="field">
                <div class="label">Email Address</div>
                <div class="value">
                    <a href="mailto:{{email_address}}" style="color: #1e5a96; text-decoration: none;">
                        {{email_address}}
                    </a>
                </div>
            </div>
            
            <div class="field">
                <div class="label">Interested Service</div>
                <div class="value">{{interested_service}}</div>
            </div>
            
            <div class="field">
                <div class="label">Message</div>
                <div class="value" style="white-space: pre-wrap; word-wrap: break-word;">{{message}}</div>
            </div>
        </div>
        
        <div class="footer">
            <div class="company-info">
                <strong>S.R.B Engineering & Construction Pvt. Ltd.</strong><br>
                KA. MA. PA-16, Kathmandu<br>
                <a href="tel:+97798439197 96" style="color: #1e5a96; text-decoration: none;">+977 9843919796</a> | 
                <a href="mailto:info@srbeng.com" style="color: #1e5a96; text-decoration: none;">info@srbeng.com</a>
            </div>
            <p style="margin: 15px 0 0 0;">This is an automated message from your website contact form.</p>
        </div>
    </div>
</body>
</html>
```

## Variable Names Used

These are the template variables you'll use in EmailJS. Make sure to use exactly these names:

- `{{full_name}}` - Customer's full name
- `{{phone_number}}` - Customer's phone number
- `{{email_address}}` - Customer's email address
- `{{interested_service}}` - The service they selected
- `{{message}}` - The message content

---

## Steps to Create Template in EmailJS

1. Go to **EmailJS Dashboard** → **Email Templates**
2. Click **Create New Template**
3. Fill in:
   - **Template Name**: `contact_form` (or any name you prefer)
   - **Subject**: `New Contact Form Submission - {{full_name}}`
   
4. In the **Content** section, paste the HTML code above
5. Click **Save**
6. Copy the **Template ID** (format: `template_xxxxxxxxx`)
7. Provide me with the Template ID and we'll complete the integration!

---

## Summary of Your EmailJS Credentials

- ✅ **Service ID**: `service_6icbh5e`
- ✅ **Public Key**: `CfMFd7I-JWmaqUQYD`
- ✅ **Private Key**: `fUJ0TfsBZuu0q2Wqa5OPF` (keep this safe!)
- ⏳ **Template ID**: (waiting for you to create and provide)

Once you provide the **Template ID**, I'll complete the Contact.tsx integration!
