import React,{useState,useEffect} from "react";
import api from "../api";


const FileUpload=({fetchFiles})=>{
    const [file,setFile]=useState(null)
    const [message,setMessage]=useState('')

    const handleFileChange=(e)=>{
        setFile(e.target.files[0])
    }

    const handleFileUpload=async ()=>{
        if(!file){
            setMessage('Please Upload The File')
            return
        }

        const formData=new FormData();
        formData.append('file',file)

        try {
            const token = localStorage.getItem('token')
            const response=await api.post("/api/files/upload/",formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
        });
        setMessage("File Uploded Successfully")
        setFile(null);
        fetchFiles();        

        } catch (error) {
            setMessage('Failed to upload file.');
            console.error(error)
        }

    }

    return (
        <div>
            <h2>File Upload</h2>
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleFileUpload}>Upload</button>
            <p>{message}</p>
        </div>
    )
}

export default FileUpload