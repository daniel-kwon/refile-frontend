import './LandingPage.css';
import * as FaIcons from "react-icons/fa"
import React, {useEffect, useState} from "react";
import FolderList from './components/FolderList';
import ThreadList from './components/ThreadList';
import { getSyncAttachments, getFirstAttachments, getUserInformation } from './ApiContract';
import AddNewFolder from './AddNewFolder';
import QuickFilterList from './components/QuickFilterList';
import AttachmentsTable from './components/AttachmentsTable';
import { Attachment } from './models/Attachment';
import { User } from './models/User';

import AttachmentModel from './models/AttachmentModel';

function LandingPage() {
  const [workspace, setWorkspace] = useState("files");
 
  useEffect(() => pushingP2(), [])
  useEffect(() => getUserInfo(), [])
  

  const [folderSelected, setFolderSelected] = useState();
  const [threadSelected, setThreadSelected] = useState();

  const folderPresetList = [
    {name: 'All attachments'},
    {name: 'Bookmark'},
    {name: 'Receipt'},
    {name: 'Design'},
    {name: 'Invoice'},
    {name: 'Contract'}
  ];

  const threadPresetList = [
    {name: 'Thread1', sender: 'tosh@gmail.com', date: '07/14/2021'},
    {name: 'Thread2', sender: 'tosh@gmail.com', date: '07/14/2021'},
    {name: 'Thread3', sender: 'tosh@gmail.com', date: '07/14/2021'},
  ];

  const quickFiltersList = [
    {name: 'sent by me'},
    {name: 'from past year'},
    {name: 'pdf files'},
  ];

  const [folders, setFolders] = useState(folderPresetList);
  const [threads, setThreads] = useState(threadPresetList);

  const [quickFilters, setQuickFilters] = useState(quickFiltersList);

  function addFolder(folder) {
      setFolders([folder, ...folders]);
  }

  function addQuickFilters(quickFilters) {
    setFolders([quickFilters, ...quickFilters]);
  }

  const [attachments, setAttachments] = useState([]);
  const [userInfo, setUserInfo]= useState([]);

  const arraylist = [];

  async function getUserInfo() {
    var userInfo = await getUserInformation();
    console.log(userInfo.categories);
    setUserInfo(userInfo)
  }

  async function pushingP2() {
    var attachments = await getFirstAttachments();
    console.log("result from p3 is: " + attachments);
    setAttachments(attachments);
  }



  async function refreshAttachments() {
    setAttachments([]);
    var result = await getSyncAttachments();
    console.log("result from p3 is: " + result);
    setAttachments(result);
  }

  
  return (
    <div className="app">
      <button onClick={refreshAttachments}>REFRESH ATTACHMENTS</button>

      <div className="app__header">
        <p className="header__title">Re:File</p>
        <p className="header__subtitle">{userInfo.email}</p>

        <form className="header__searchform" >
          <input 
            type="text"
            className='header__searchform__input'
            placeholder="Search file names, users, or subjects">
          </input>
          <FaIcons.FaSearch
            className='header__searchform__submit'
            type="submit"
            value="Search">
          </FaIcons.FaSearch> 
        </form>
      </div>

      <div className="app__main">
        <div className="app__folder">
          <AddNewFolder addFolder={addFolder}/>
          <p className='app__folder__title'>Threads</p>
          <ThreadList setThreadSelected={setThreadSelected} threads={threads}></ThreadList>
        </div>

        <div className="app__attachments">
            <p className='app__toolbar__option_title' onClick={() => setWorkspace("files")}>Files</p>
            <p className='app__toolbar__option_title' onClick={() => setWorkspace("folders")} >Folders</p>
            
            {workspace == "files" && 
              <AttachmentsTable from={'files'} attachments={attachments}></AttachmentsTable> 
            }

            {workspace == "folders" && 
              <div>
                <FolderList setFolderSelected={setFolderSelected} folders={userInfo.categories} />
                <p>{folderSelected}</p>

                <AttachmentsTable from={'folders'} filter={folderSelected} attachments={attachments}></AttachmentsTable>
                


              </div>
            }    

        </div>
      </div>

    </div>
  );
}

export default LandingPage;
