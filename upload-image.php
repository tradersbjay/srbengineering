<?php
/**
 * Image Upload Handler for S.R.B Engineering & Construction
 * 
 * This script handles image uploads from the admin panel.
 * Place this file in your public_html directory (same level as index.html)
 */

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 0 in production

// Set JSON header
header('Content-Type: application/json');

// CORS headers (adjust domain in production)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Configuration
$uploadDir = 'uploads/projects/'; // Directory to store uploaded images
$maxFileSize = 5 * 1024 * 1024; // 5MB max file size
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

// Create upload directory if it doesn't exist
if (!file_exists($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        echo json_encode(['success' => false, 'message' => 'Failed to create upload directory']);
        exit();
    }
}

// Check if file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] === UPLOAD_ERR_NO_FILE) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded']);
    exit();
}

$file = $_FILES['image'];

// Check for upload errors
if ($file['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive in php.ini',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive in HTML form',
        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload'
    ];
    
    $message = $errorMessages[$file['error']] ?? 'Unknown upload error';
    echo json_encode(['success' => false, 'message' => $message]);
    exit();
}

// Validate file size
if ($file['size'] > $maxFileSize) {
    echo json_encode(['success' => false, 'message' => 'File size exceeds 5MB limit']);
    exit();
}

// Validate file type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only images are allowed']);
    exit();
}

// Validate file extension
$fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($fileExtension, $allowedExtensions)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file extension']);
    exit();
}

// Generate unique filename
$timestamp = time();
$randomString = bin2hex(random_bytes(8));
$newFilename = "project_{$timestamp}_{$randomString}.{$fileExtension}";
$targetPath = $uploadDir . $newFilename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode(['success' => false, 'message' => 'Failed to save uploaded file']);
    exit();
}

// Optional: Optimize image (requires GD library)
optimizeImage($targetPath, $mimeType);

// Get the full URL to the uploaded file
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$fileUrl = "{$protocol}://{$host}/{$targetPath}";

// Return success response
echo json_encode([
    'success' => true,
    'url' => $fileUrl,
    'filename' => $newFilename,
    'size' => filesize($targetPath),
    'type' => $mimeType
]);

/**
 * Optimize uploaded image
 * 
 * @param string $filePath Path to the image file
 * @param string $mimeType MIME type of the image
 */
function optimizeImage($filePath, $mimeType) {
    // Maximum dimensions
    $maxWidth = 1920;
    $maxHeight = 1280;
    $quality = 85; // JPEG quality (0-100)
    
    // Get image dimensions
    list($width, $height) = getimagesize($filePath);
    
    // Check if resizing is needed
    if ($width <= $maxWidth && $height <= $maxHeight) {
        return; // No optimization needed
    }
    
    // Calculate new dimensions
    $ratio = min($maxWidth / $width, $maxHeight / $height);
    $newWidth = round($width * $ratio);
    $newHeight = round($height * $ratio);
    
    // Create image resource based on type
    switch ($mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            $source = imagecreatefromjpeg($filePath);
            break;
        case 'image/png':
            $source = imagecreatefrompng($filePath);
            break;
        case 'image/gif':
            $source = imagecreatefromgif($filePath);
            break;
        case 'image/webp':
            $source = imagecreatefromwebp($filePath);
            break;
        default:
            return; // Unsupported type
    }
    
    if (!$source) {
        return; // Failed to create image resource
    }
    
    // Create new image
    $destination = imagecreatetruecolor($newWidth, $newHeight);
    
    // Preserve transparency for PNG and GIF
    if ($mimeType === 'image/png' || $mimeType === 'image/gif') {
        imagealphablending($destination, false);
        imagesavealpha($destination, true);
        $transparent = imagecolorallocatealpha($destination, 255, 255, 255, 127);
        imagefilledrectangle($destination, 0, 0, $newWidth, $newHeight, $transparent);
    }
    
    // Resize image
    imagecopyresampled($destination, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
    
    // Save optimized image
    switch ($mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            imagejpeg($destination, $filePath, $quality);
            break;
        case 'image/png':
            imagepng($destination, $filePath, 8); // Compression level 0-9
            break;
        case 'image/gif':
            imagegif($destination, $filePath);
            break;
        case 'image/webp':
            imagewebp($destination, $filePath, $quality);
            break;
    }
    
    // Free memory
    imagedestroy($source);
    imagedestroy($destination);
}
?>
