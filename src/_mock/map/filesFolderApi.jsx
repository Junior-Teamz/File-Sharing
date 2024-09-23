import { useFetchFolder } from "src/sections/overview/app/view/folders"

export const handleFolderFiles = () => {
    const {data} = useFetchFolder()
    
    const folderss = data.folders.map((folder, id) => {
        return folder
    })

    const filess = data.files.map((files)=> {
        return files
    })

    const FolderFiles = [...folderss, ...filess];

    return {
       FolderFiles
    }
  
}

