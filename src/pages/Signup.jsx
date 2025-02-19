// React Imports
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// Custom Hooks Imports
import { useSession } from '@hooks';
// Inrupt Imports
import { getThing, getWebIdDataset, getStringNoLocale } from '@inrupt/solid-client';
import { FOAF } from '@inrupt/vocab-common-rdf';
// Material UI Imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
// Constant Imports
import { ENV } from '@constants';
// Signup Form Imports
import {
  PodRegistrationForm,
  ShowNewPod,
  initializePod,
  registerPod,
  ExistingPodForm
} from '@components/Signup';

/**
 * Signup - First screen in the user registration flow.
 * Allows users to either create a pod, or sign into an existing pod
 *
 * @memberof Pages
 * @name Signup
 * @returns {React.Component} - A React Page
 */
const Signup = () => {
  const [oidcIssuer] = useState(ENV.VITE_SOLID_IDENTITY_PROVIDER);
  const [storredIssuer, setStorredIssuer] = useState(null);
  const [searchParams] = useSearchParams();
  const caseManagerWebId = decodeURIComponent(searchParams.get('webId'));
  const [caseManagerName, setCaseManagerName] = useState();
  const [step, setStep] = useState('begin');
  const [registrationInfo, setRegistrationInfo] = useState({});

  const { session } = useSession();

  const registerAndInitialize = async (email, password, confirmPassword) => {
    setStep('loading');
    const registration = await registerPod(
      {
        email,
        password,
        confirmPassword
      },
      oidcIssuer
    );
    setRegistrationInfo(registration);
    const caseManagerNames = caseManagerName?.split(' ') || [];
    await initializePod(
      registration.webId,
      registration.podUrl,
      {
        caseManagerWebId,
        caseManagerFirstName: caseManagerNames[0],
        caseManagerLastName: caseManagerNames[caseManagerNames.length - 1]
      },
      registration.fetch
    );
    setStep('done');
  };

  const loadProfileInfo = async () => {
    if (caseManagerWebId === 'null') return;
    try {
      const profile = await getWebIdDataset(caseManagerWebId);
      const profileThing = getThing(profile, caseManagerWebId);
      setCaseManagerName(getStringNoLocale(profileThing, FOAF.name));
    } catch {
      setCaseManagerName(null);
    }
  };

  useEffect(() => {
    loadProfileInfo();

    if (session.info.isLoggedIn === true) {
      setStep('done');
    } else {
      setStep('begin');
    }

    const storedOidcIssuer = localStorage.getItem('oidcIssuer', oidcIssuer);
    setStorredIssuer(storedOidcIssuer);
  }, [session.info.isLoggedIn, window.location.href]);

  return (
    <Container>
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={2}
          sx={{
            display: 'inline-block',
            mx: '2px',
            padding: '20px',
            minWidth: '400px',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
          }}
        >
          {step === 'begin' && (
            <>
              <PodRegistrationForm
                register={registerAndInitialize}
                caseManagerName={caseManagerName}
              />
              <ExistingPodForm />
            </>
          )}
          {step === 'loading' && <Typography>Creating Pod...</Typography>}
          {step === 'done' && (
            <ShowNewPod
              oidcIssuer={oidcIssuer}
              oidcExisting={storredIssuer}
              podUrl={registrationInfo.podUrl}
              webId={session.info.webId}
            />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
