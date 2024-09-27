import React, { useState, useRef, useEffect, useContext } from 'react';
import { BiExport, BiImport } from "react-icons/bi";
import {Button, Row, Col, Container, ListGroup, Table, Form, Carousel} from 'react-bootstrap';
import Context from "../context";
import { GoChevronUp, GoChevronDown, GoChevronRight } from 'react-icons/go'; // Import chevron icons


const ProfilesConfiguration = () => {
  const context= useContext(Context)
  const [collapsed, setCollapsed] = useState(true); // State to manage collapse
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  
  
  const profiles = Array.from({ length: 15 }, (_, index) => index + 1);

  const handleCheckboxChange = (profileNumber) => {
    setSelectedProfiles(prev =>
      prev.includes(profileNumber)
        ? prev.filter(profile => profile !== profileNumber)
        : [...prev, profileNumber]
    );
  };


    // Function to toggle collapse state
    const toggleCollapse = () => {
      setCollapsed(!collapsed);
    }

  const exportSelectedSkills = () => {
    const data = JSON.stringify(context.selectedSkills, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selectedSkills.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

    function UploadButton({ handleFileChange }) {
    const inputFileRef = useRef(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);
  
    useEffect(() => {
      inputFileRef.current = document.getElementById('input-file');
    }, []);
  
    const handleDisplayFileDetails = () => {
      if (inputFileRef.current?.files && inputFileRef.current.files.length > 0) {
        setUploadedFileName(inputFileRef.current.files[0].name);
      }
    };
  
    const handleImport = () => {
      inputFileRef.current.click();
    };
  
    return (
      <>
        <input
          id="input-file"
          onChange={(e) => {
            handleDisplayFileDetails();
            handleFileChange(e);
          }}
          className="d-none"
          type="file"
          accept=".json"
        />
        <Button
          onClick={handleImport}
          className="mainButtons"
        ><BiImport size={20} style={{ marginRight: '8px' }} />
          {uploadedFileName ? uploadedFileName : 'Import Profiles'}
        </Button>
      </>
    );
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedSkills = JSON.parse(e.target.result);
        context.setSelectedSkills(importedSkills);
        alert('Profiles imported successfully!');
      } catch (error) {
        alert('Error importing profiles.');
      }
    };

    reader.readAsText(file);
  };

  const handleResetSkills = () => {
    const confirmed = window.confirm(`Are you sure you want to reset all profiles? This will clear all skills and items.`);
  if (confirmed) {
    context.setSelectedSkills(Array.from({ length: 15 }, () => ({})));
    localStorage.removeItem('selectedSkills');
  }
  };

 const handleResetProfile = () => {
    const confirmed = window.confirm(`Are you sure you want to reset Profile ${currentProfile}? This will clear all selected skills and items.`);
  if (confirmed) {
      context.setSelectedSkills((prevSelectedSkills) => {
      const newSelectedSkills = [...prevSelectedSkills];
      newSelectedSkills[currentProfile - 1] = {};
      return newSelectedSkills;
    });
  }
};

const handleResetProfiles = () => {
  if (selectedProfiles.length === 0) {
    return; // Do nothing if no profiles are selected
  }

  const confirmed = window.confirm(`Are you sure you want to reset the selected profiles? This will clear all selected skills and items.`);
  if (confirmed) {
    context.setSelectedSkills((prevSelectedSkills) => {
      const newSelectedSkills = [...prevSelectedSkills];
      selectedProfiles.forEach(profileNumber => {
        newSelectedSkills[profileNumber - 1] = {}; // Reset selected profile
      });
      return newSelectedSkills;
    });
    // Clear the selected profiles after reset
    setSelectedProfiles([]);
  }
};

  
const [currentProfile, setCurrentProfile] = useState(1);


return (
<div className="backgroundColor">
<div className="component-title">PROFILES CONFIGURATION</div>
<Container style={{paddingTop: 0}}>
  <div className="configuration-buttons">
    
    <UploadButton handleFileChange={handleFileChange} className="mainButtons"/>
    
    <Button onClick={exportSelectedSkills} className="mainButtons"><BiExport size={20} style={{ marginRight: '8px' }}/>Export Profiles</Button>
    
    <Button onClick={handleResetSkills} variant="danger" className="mainButtons">Reset All Profiles</Button>
    
    <div className={`reset-profile-container ${!collapsed ? "active" : ""}`}>
      <Button onClick={toggleCollapse} className="mainButtons">
        Select Profiles to Reset {!collapsed ? <GoChevronUp /> : <GoChevronDown />}
      </Button>
      {/* Conditionally render the div based on collapsed state */}
      {!collapsed && (
            <>
            <Form.Group className="reset-profile-main">
                <Form className="mainForm">
                  <Row>
                    {profiles.map(profileNumber => (
                      <Col xs={6} md={4} lg={3} key={profileNumber} className="mb-1 mt-1">
                        <Form.Check 
                          type="checkbox"
                          id={`profile-${profileNumber}`}
                          label={`Profile ${profileNumber}`}
                          checked={selectedProfiles.includes(profileNumber)}
                          onChange={() => handleCheckboxChange(profileNumber)}
                        />
                      </Col>
                    ))}
                  </Row>
                </Form>
              </Form.Group>
              <Button onClick={handleResetProfiles} className="mainButtons" variant="outline-danger">
                Reset Selected Profiles
              </Button>
          </>
      )}
    </div>
  </div>

</Container>

</div>
);
};
export default ProfilesConfiguration;