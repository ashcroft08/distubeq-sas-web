import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

/**
 * Configures cloudinary with current environment variables
 */
function initCloudinary() {
    const cloud_name = env.CLOUDINARY_CLOUD_NAME?.trim();
    const api_key = env.CLOUDINARY_API_KEY?.trim();
    const api_secret = env.CLOUDINARY_API_SECRET?.trim();

    if (!cloud_name || !api_key || !api_secret) {
        console.warn('Cloudinary environment variables are missing or empty!');
    }
    
    cloudinary.config({
        cloud_name,
        api_key,
        api_secret,
        secure: true
    });
}

/**
 * Uploads a file to Cloudinary
 * @param {string} fileData - Base64 string or file path
 * @param {string} folder - Destination folder
 * @returns {Promise<{url: string, public_id: string}>}
 */
export async function uploadImage(fileData, folder = 'distubeq/products') {
    initCloudinary();
    try {
        console.log('Attempting upload to folder:', folder);
        const result = await cloudinary.uploader.upload(fileData, {
            folder,
            resource_type: 'auto'
        });
        return {
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
}

/**
 * Deletes an image from Cloudinary
 * @param {string} publicId - Cloudinary public id
 * @returns {Promise<any>}
 */
export async function deleteImage(publicId) {
    if (!publicId) return;
    initCloudinary();
    try {
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
        throw error;
    }
}
