// React Imports
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// Material UI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
// Other Imports
import HMIS_FORM_LIST from './FormList';

/**
 * FormLayout - Component that contains the Civic Profile forms
 *
 * @memberof CivicProfileForms
 * @name FormLayout
 * @param {object} props - The props for the FormLayout component
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the main content area
 * @returns {React.ReactNode} The layout for Civic Profile forms
 */
const FormLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname.split('/').pop();

  localStorage.setItem('restorePath', location.pathname);
  const pageIdx = HMIS_FORM_LIST.findIndex((form) => form.path === path);

  return (
    <Box sx={{ margin: '8px' }}>
      <Card>{children}</Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {pageIdx > 0 ? (
          <Link component={RouterLink} to={`../${HMIS_FORM_LIST[pageIdx - 1].path}`}>
            &lt; Prev
          </Link>
        ) : (
          <Box />
        )}
        {pageIdx < HMIS_FORM_LIST.length - 1 ? (
          <Link component={RouterLink} to={`../${HMIS_FORM_LIST[pageIdx + 1].path}`}>
            Next &gt;
          </Link>
        ) : (
          <Box />
        )}
      </Box>
    </Box>
  );
};

export default FormLayout;
