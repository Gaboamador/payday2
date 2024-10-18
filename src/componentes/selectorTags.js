import React, { useEffect, useState, useRef, useContext } from "react";
import {ButtonGroup, Button, Row, Col, Container, ListGroup, Table, Form, Card} from 'react-bootstrap';
import { GoChevronUp, GoChevronDown } from 'react-icons/go';
import '../App.css';
// import tagsRaw from '../database/tags.json'
import { modCategoryNames } from "../database/modCategoryNames";
import Context from "../context";
import { fetchData } from './DataService';


const BuildSelectorTags = () => {
  const context= useContext(Context)

  const [tagsRaw, setTagsRaw] = useState([]);
  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const { tagsRawOnline } = await fetchData();
        setTagsRaw(tagsRawOnline);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchDataFromAPI();
  }, []);
  
  const tags = tagsRaw.sort()

 // Retrieve and parse profiles from localStorage
//  const profiles = JSON.parse(localStorage.getItem('selectedSkills')) || [];
    const profiles = context.selectedSkills
 const [selectedTags, setSelectedTags] = useState([]);
 const [filteredProfiles, setFilteredProfiles] = useState([]);
 const [expandedProfileIndex, setExpandedProfileIndex] = useState(null);


 // Assign static numbers to profiles
 const profilesWithStaticNumbers = profiles.map((profile, index) => ({
  ...profile,
  staticNumber: index + 1 // Assign static number based on original index
}));

 // Effect to filter profiles based on selected tags
 useEffect(() => {
   if (selectedTags.length > 0) {
     const matchedProfiles = profilesWithStaticNumbers.filter(profile => 
       selectedTags.every(tag => profile.tags?.includes(tag))
     );
     setFilteredProfiles(matchedProfiles);
   } else {
     setFilteredProfiles(profilesWithStaticNumbers);
   }
 }, [selectedTags]);

 const handleTagChange = (tag, isChecked) => {
   setSelectedTags(prevTags => {
     if (isChecked) {
       return [...prevTags, tag];
     } else {
       return prevTags.filter(t => t !== tag);
     }
   });
 };

 const toggleProfileDetails = (index) => {
   setExpandedProfileIndex(prevIndex => prevIndex === index ? null : index);
 };

 const getProfileData = (profile) => {
  if (!profile) return 'No profile data';

   // Helper function to format mods as a string
   const formatMods = (mods) => {
    if (!mods || Object.keys(mods).length === 0) return '';

    return Object.entries(mods)
      .map(([modCategory, modValue]) => `${modCategoryNames[modCategory] || modCategory}: ${modValue}`)
      .join(', ');
  };

   // Helper function to get tags
   const getTags = (tags) => {
    if (!tags || tags.length === 0) return [];
    return tags.sort(); // Sort tags for display
  };


  return {
    perkDeck: profile.perkDeck || 'No data available',
    primaryWeapon: profile.primaryWeapon ? `${profile.primaryWeapon.weapon}` : 'No data available',
    primaryWeaponMods: profile.primaryWeapon ? formatMods(profile.primaryWeapon.mods) : 'No data available',
    secondaryWeapon: profile.secondaryWeapon ? `${profile.secondaryWeapon.weapon}` : 'No data available',
    secondaryWeaponMods: profile.secondaryWeapon ? formatMods(profile.secondaryWeapon.mods) : 'No data available',
    melee: profile.melee || 'No data available',
    throwable: profile.throwable || 'No data available',
    armor: profile.armor || 'No data available',
    equipment: profile.equipment || 'No data available',
    // tags: profile.tags && profile.tags.length > 0 ? profile.tags.sort().join(', ') : 'No tags available'
    tags: getTags(profile.tags), 
  };
};

// Helper function to render mods in a grid layout
const renderModsGrid = (mods) => {
  if (!mods || Object.keys(mods).length === 0) {
    // return <div>No mods available</div>;
    return ;
  }

  return (
    <div className="mods-grid">
      {Object.entries(mods).map(([modCategory, modValue], index) => (
        <React.Fragment key={index}>
          <div className="profile-grid-title mods">{modCategoryNames[modCategory] || modCategory}</div>
          <div className="profile-grid-name mods">{modValue}</div>
        </React.Fragment>
      ))}
    </div>
  );
};

// Helper function to render tags in a grid layout
const renderTagsGrid = (tags) => {
  if (!tags || tags.length === 0) {
    return <div>No tags available</div>;
  }

  return (
    <div className="tags-grid">
      {tags.map((tag, index) => (
        <div key={index} className="tag-item">{tag}</div>
      ))}
    </div>
  );
};

const [isFormVisible, setIsFormVisible] = useState(false);

const toggleFormVisibility = () => {
  setIsFormVisible(!isFormVisible);
};

return (
      <div className="backgroundColor">
        <div className="component-title">SEARCH BY TAGS</div>
<Container style={{paddingTop: 0}}>
  <Form className="mainForm selectorTags">
      <Form.Label onClick={toggleFormVisibility} className="form-title">
        Select Tags
        {isFormVisible ? (<GoChevronUp />) : (<GoChevronDown />)}
      </Form.Label>
    {isFormVisible && (
      <Row>
        {tags.map(tag => (
          <Col xs={6} md={4} lg={3} key={tag} className="mb-1 mt-1">
            <Form.Check
              type="checkbox"
              id={`tag-${tag}`}
              label={tag}
              onChange={(e) => handleTagChange(tag, e.target.checked)}
            />
          </Col>
        ))}
      </Row>
    )}
  </Form>

      <div>
      <h3>Matched Profiles</h3>
      {filteredProfiles.length === 0 ? (
        <div className="noProfilesMatched">No profiles matched</div>
      ) : (
        <>
        {filteredProfiles.map((profile, index) => {
          const profileData = getProfileData(profile);
          return (
            <div key={index}>
              <div 
                onClick={() => toggleProfileDetails(index)} 
                className={`profileTitle ${expandedProfileIndex === index ? "profile-grid-item number" : ""}`}
              >
                Profile {profile.staticNumber}
              </div>
              {expandedProfileIndex === index && (
                <div className="profile-grid-container">
                  <div className="profile-grid-item">
                    <div className="profile-grid-content">
                      <div className="profile-grid-title">PERK DECK</div>
                      <div className="profile-grid-name">{profileData.perkDeck}</div>
                    </div>
                  </div>

                  <div className="profile-grid-item">
                    <div className="profile-grid-content">
                      <div className="profile-grid-title">PRIMARY</div>
                      <div className="profile-grid-name">{profileData.primaryWeapon}</div>
                    </div>
                      {profile.primaryWeapon && renderModsGrid(profile.primaryWeapon.mods)}
                  </div>

                  <div className="profile-grid-item">
                    <div className="profile-grid-content">
                      <div className="profile-grid-title">SECONDARY</div>
                      <div className="profile-grid-name">{profileData.secondaryWeapon}</div>
                    </div>
                    {profile.secondaryWeapon && renderModsGrid(profile.secondaryWeapon.mods)}
                  </div>

                  <div className="profile-grid-item">
                    <div className="profile-grid-content">
                      <div className="profile-grid-title">MELEE</div>
                      <div className="profile-grid-name">{profileData.melee}</div>
                    </div>
                  </div>

                  <div className="profile-grid-item">
                    <div className="profile-grid-content">
                      <div className="profile-grid-title">THROWABLE</div>
                      <div className="profile-grid-name">{profileData.throwable}</div>
                    </div>
                  </div>

                  <div className="profile-grid-item">
                    <div className="profile-grid-content">
                      <div className="profile-grid-title">ARMOR</div>
                      <div className="profile-grid-name">{profileData.armor}</div>
                    </div>
                  </div>

                  <div className="profile-grid-item">
                    <div className="profile-grid-content">
                      <div className="profile-grid-title">EQUIPMENT</div>
                      <div className="profile-grid-name">{profileData.equipment}</div>
                    </div>
                  </div>

                  <div className="profile-grid-item">
                    <div className="profile-grid-content">
                      <div className="profile-grid-title">TAGS</div>
                    </div>
                    {renderTagsGrid(profileData.tags)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </>
      )}
      </div>
</Container>
</div>
    );
  };
  export default BuildSelectorTags;