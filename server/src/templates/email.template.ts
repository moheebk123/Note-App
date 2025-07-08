export const VERIFICATION_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <title>Verification Code</title>
    <style>
        /* General styling for the email */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4caf50;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            color: #333333;
        }
        .content p {
            margin: 0 0 15px;
            font-size: 16px;
        }
        .verification-code {
            font-size: 24px;
            color: #4caf50;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Your Verification Code</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Thank you for signing up! To complete your verification, please use the code below:</p>
            <div class="verification-code">{verificationCode}</div>
            <p>If you didn’t request this email, please ignore it.</p>
            <p>Best regards,<br>Moheeb Khan</p>
        </div>
        <div class="footer">
            <p><strong>Developer: <i>Moheeb Khan</i></strong></p>
            <p>Want to now more about the developer <a href='https://moheeb-khan-portfolio.vercel.app'>Click here</a></p>
        </div>
    </div>
</body>
</html>
`;
