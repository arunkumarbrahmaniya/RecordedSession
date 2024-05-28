import React, {useState} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import '../../src/customcss/custom.css'
import SessionDialog from '../Dialogs/SessionDialog';

const MyProjects = () => {
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const handleSessionDialog = () => {
    setOpenSessionDialog(true);
  }
  const setVisible = () => {
    setOpenSessionDialog(false);
  }
  return (
    <>
    <SessionDialog openSessionDialog={openSessionDialog} setVisible={setVisible} />
    <div className="container my-projects">
      <div className="d-flex justify-content-between align-items-center py-3">
        <i className="pi pi-bars fs-4"></i>
        <h1 className="m-0">My Projects</h1>
        <Button icon="pi pi-plus" className="p-button-rounded p-button-text fs-4" />
      </div>
      <TabView>
        <TabPanel header="CURRENT PROJECTS">
          <div className="my-3">
            <span className="p-input-icon-left w-100">
              <i className="pi pi-search" style={{lineHeight:'0', verticalAlign:'middle'}}/>
              <InputText placeholder="Search current projects" className="w-100" style={{height: '40px'}}/>
            </span>
          </div>
          <Card style={{padding: '20px'}} title="All Type Session Open" subTitle="Start Date: 25 Jan 2022 | End Date: 10 Dec 2025" className="mb-3">
            <p>Submitted: 0 Session(s)</p>
            <div className="d-flex justify-content-end">
              <Button style={{borderRadius:'4px', padding:'5px'}} className="p-button-rounded p-button-primary" onClick={handleSessionDialog}>
                <i className='pi pi-play'></i>Start
              </Button>
            </div>
          </Card>
        </TabPanel>
        <TabPanel header="PAST PROJECTS">
          {/* Add content for past projects here */}
        </TabPanel>
      </TabView>
    </div>
    </>
  );
};

export default MyProjects;
