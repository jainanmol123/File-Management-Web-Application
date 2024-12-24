import React,{useEffect,useState} from "react";
import api from "../api";
import "../styles/Home.css"

const FileList=({fileList,fetchFiles})=>{

    const[message,setMessage]=useState('')



    const handleDelete = async (fileId) => {
        try {
            await api.delete(`/api/files/delete/${fileId}/`);
            //alert('File deleted successfully!');
            fetchFiles(); // Refresh the file list
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete the file.');
        }
    };

    const handleFileDownload=async(field)=>{
         
        try {
            // Send a GET request to fetch the file
            const response = await api.get(`api/files/download/${field}`, {
                responseType: 'blob', // Ensure the response is treated as a blob
            });
        
            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
        
            // Create a temporary anchor element
            const link = document.createElement('a');
            link.href = url;
        
            // Set the filename dynamically using `content-disposition` header, if available
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'file.jpg'; // Default filename
        
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?(.+)"?/);
                if (match) {
                    filename = match[1];
                }
            }
        
            link.setAttribute('download', filename); // Set the filename
            document.body.appendChild(link);
        
            // Programmatically trigger the download
            link.click();
        
            // Clean up the temporary URL and element
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
        
        
        }
        return (
            <div>
                <h2>Uploaded Files</h2>
                {message && <p>{message}</p>}
                
                <ul>
                    {fileList.map((file) => (
                        <li key={file.id} className="file-item">
                            <span className="file-info">{file.file}</span>
                            <span className="file-info">{new Date(file.uploaded_at).toLocaleString()}</span>
                            <button className="file-button" onClick={() => handleFileDownload(file.id)}>
                                Download
                            </button>
                            <button className="file-delete" onClick={() => handleDelete(file.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
                
            </div>
        );   


}

export default FileList;