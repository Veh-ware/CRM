import React, { useState } from "react";

type CloudinaryUploadProps = {
    file: File | null;
    onUploadComplete: (url: string | null) => void; 
};

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ file, onUploadComplete }) => {
    const [uploading, setUploading] = useState<boolean>(false); // To track the upload process

    // Handle the upload process
    const uploadImage = async () => {
        if (!file) {
            onUploadComplete(null); // Return null if no file is provided
            console.log("Please provide an image to upload.");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "vehware"); // Replace with your unsigned upload preset
        formData.append("cloud_name", "dv3pq6g96"); // Replace with your Cloudinary cloud name

        try {
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dv3pq6g96/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                const data = await response.json();
                onUploadComplete(data.secure_url); // Pass the uploaded image URL back to the parent
                console.log("Image uploaded successfully!");
            } else {
                const errorData = await response.json();
                console.error("Upload failed:", errorData);
                onUploadComplete(null);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            onUploadComplete(null);
            console.log("An error occurred. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    React.useEffect(() => {
        if (file) {
            uploadImage();
        }
    }, [file]); // Trigger upload when a new file is passed

    return uploading ? <p>Uploading...</p> : null; // Show a message while uploading
};

export default CloudinaryUpload;

