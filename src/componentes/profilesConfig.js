import React, { useState, useRef, useEffect, useContext } from 'react';
import { BiExport, BiImport } from "react-icons/bi";
import {Button, Row, Col, Container, ListGroup, Table, Form, Carousel, Dropdown, ButtonGroup} from 'react-bootstrap';
import Context from "../context";
import { GoChevronUp, GoChevronDown, GoChevronRight } from 'react-icons/go'; // Import chevron icons
import { supabase } from '../supabaseClient';
import Auth from '../Auth'
import Account from '../Account'


const ProfilesConfiguration = () => {
  const context= useContext(Context)
  
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  
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
          className="mainButtons">
          {/* <BiImport size={20} style={{ marginRight: '8px' }} />
          {uploadedFileName ? uploadedFileName : 'Import Profiles'} */}
          Import Profiles<br/>(load from device)
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

// START UPLOAD PROFILES TO SUPABASE STORAGE
const uploadJsonData = async (data, fileName) => {
  const bucketName = 'my-bucket'; // Replace with your bucket name

  // Convert the data to a JSON string
  const jsonData = JSON.stringify(data);

  // Upload the JSON string as a file
  const { error } = await supabase
    .storage
    .from(bucketName)
    .upload(fileName, new Blob([jsonData], { type: 'application/json' }), {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading JSON data:', error.message);
    return;
  }

  console.log('JSON data uploaded successfully');
};

// const userPrefix = context.user ? context.user.split('@')[0].trim() + '_' + context.user.split('@')[1].split('.')[0].trim() : '';
const userPrefix = context.user && context.user.includes('@') && context.user.includes('.')
  ? context.user.split('@')[0].trim() + '_' + context.user.split('@')[1].split('.')[0].trim()
  : '';
const userConfirmUpload = userPrefix.split('_')[0].trim()

const handleUpload = async () => {
  // const fileName = 'selectedSkills.json';
  const fileName = `profiles_${userPrefix}.json`;
  
     // Display a confirmation dialog to the user
     const confirmUpload = window.confirm(`Upload profiles of ${userConfirmUpload}?`);
  
     // If the user cancels, exit the function early
     if (!confirmUpload) {
       return;
     }

  await uploadJsonData(context.selectedSkills, fileName);
};
// END UPLOAD PROFILES TO SUPABASE STORAGE

// START DOWNLOAD PROFILES FROM SUPABASE STORAGE
const fetchJsonData = async () => {
  const bucketName = 'my-bucket'; // Replace with your bucket name
  const userPrefix = context.user && context.user.includes('@') && context.user.includes('.') 
  ? context.user.split('@')[0].trim() + '_' + context.user.split('@')[1].split('.')[0].trim()
  : '';
  const fileName = `profiles_${userPrefix}.json`;
  const userConfirmDownload = userPrefix.split('_')[0].trim()

// Display a confirmation dialog to the user
const confirmDownload = window.confirm(`Download profiles of ${userConfirmDownload}?`);
  
// If the user cancels, exit the function early
if (!confirmDownload) {
  return;
}

  // Get the public URL or signed URL for the file
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .download(fileName);

  if (error) {
    console.error('Error fetching JSON file:', error.message);
    return;
  }

  // Convert the file Blob back to JSON
  const jsonData = await data.text();
  const parsedData = JSON.parse(jsonData);

  // Handle the fetched data (e.g., set it in state or log it)
  // console.log('Fetched JSON data:', parsedData);
  // You could store it in context or use it as needed:
  context.setSelectedSkills(parsedData); // Example if you want to update selectedSkills
  // Alert the user that profiles have been successfully downloaded
  alert('Profiles have been successfully downloaded!');
};
// END DOWNLOAD PROFILES FROM SUPABASE STORAGE

useEffect(() => {
if (!session) {
  context.setUser(''); // Set user to an empty string if session is false
  context.setPass('')
}
}, []);


 // Effect to handle sign-out
 useEffect(() => {
  if (!context.login) {
    const signOutUser = async () => {
      await supabase.auth.signOut();
    };
    signOutUser();
  }
}, []);


return (
<div className="backgroundColor">
<div className="component-title">PROFILES CONFIGURATION</div>

 {/* Check if the user is logged in */}
 {!session ? (
        <Container>
          <Auth />
        </Container>
) : (
  <>
  <Container className="userDataContainer">
    <Account key={session.user.id} session={session} />
  </Container>
</>
)}

<div className="separator"></div>

<Container>
  <div className="configuration-buttons">
    
     {/* Render these buttons only if session is true */}
     {session && (
        <>
      <Button onClick={handleUpload} className="mainButtons"><BiExport size={20} style={{ marginRight: '8px' }}/>Upload Profiles</Button>

      <Button onClick={fetchJsonData} className="mainButtons"><BiImport size={20} style={{ marginRight: '8px' }} />Download Profiles</Button>
      </>
      )}

    <Dropdown as={ButtonGroup} className="mainButtons dropdownLocalProfiles">
    <Button variant="primary">Local Backup</Button>

    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

    <Dropdown.Menu>
      <Dropdown.Item as="div">
        <UploadButton handleFileChange={handleFileChange} className="mainButtons" />
      </Dropdown.Item>
      
      <Dropdown.Item as="div">
        <Button onClick={exportSelectedSkills} className="mainButtons">
          {/* <BiExport size={20} style={{ marginRight: '8px' }} /> */}
          Export Profiles<br/>(save to device)
        </Button>
      </Dropdown.Item>
    </Dropdown.Menu>
    </Dropdown>

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