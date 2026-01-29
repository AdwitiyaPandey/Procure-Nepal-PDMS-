import cloudinary from '../config/cloudinary.js'

export async function uploadToCloudinary(fileBuffer, fileName, folder = 'procurenepal') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        public_id: fileName,
        timeout: 60000,
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    uploadStream.end(fileBuffer)
  })
}

export async function deleteFromCloudinary(publicId) {
  const result = await cloudinary.uploader.destroy(publicId)
  return result
}

// Commit: 2026-01-29 Ujjwal
