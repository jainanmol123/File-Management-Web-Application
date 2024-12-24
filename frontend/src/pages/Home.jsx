import FileUpload from "../components/FileUpload"
import FileList from "../components/FileList"
import api from "../api"
import { useState,useEffect } from "react";


function Home(){

    const [fileList, setFileList] = useState([]);

    const fetchFiles = async () => {
        try {
            const response = await api.get('/api/files/');
            setFileList(response.data);
        } catch (error) {
            console.error('Error fetching file list:', error);
        }
    };

    useEffect(() => {
        fetchFiles(); // Fetch files on mount
    }, []);

    return (
    <>    
    <FileUpload fetchFiles={fetchFiles}/>
    <FileList fileList={fileList} fetchFiles={fetchFiles}/>
    </>
)
}

export default Home