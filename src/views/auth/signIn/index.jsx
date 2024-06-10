/* eslint-disable */

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import AlertDialog from "../../../popup/AlertDialog";
import firebase from '../../../../src/firebase';

let patternEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const googleHover = useColorModeValue(
    { bg: "gray.200" },
    { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.200" }
  );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [values, setValues] = useState({
    userEmail: '',
    password: ''
  })

  const [spin, setSpin] = useState(false);

  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });


  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const onUserLogin = (e) => {

    console.log("USER userEmail:: ", values.userEmail);
    console.log("USER password:: ", values.password);

    setSpin(true)

    let tmpEmail = values.userEmail.toLowerCase();
    let tmpPassword = values.password;

    if (tmpEmail === "") {
      setSpin(false)
      setAlertDialog({
        isOpen: true,
        title: "Please Enter User Email-id.",
      });
    } else if (tmpPassword === "") {
      setSpin(false)
      setAlertDialog({
        isOpen: true,
        title: "Please Enter User Password.",
      });
    } else {
      if (!patternEmail.test(tmpEmail)) {
        setSpin(false);
        setAlertDialog({
          isOpen: true,
          title: "Please Enter Valid Email-id.",
        });
      } else {

        let firestoreData = firebase.firestore();

        let docRef = firestoreData.collection("user-list")
        docRef = docRef.where("email", "==", tmpEmail);
        docRef.get().then((querySnapshot) => {

          if (querySnapshot.size !== 0) {

            querySnapshot.forEach((doc) => {
              console.log("USER DOC ID ::  ", doc.data())
              let tempData = doc.data();
              if (tempData.loginFlag) {
                firebase.auth().signInWithEmailAndPassword(tmpEmail, tmpPassword)
                  .then((user) => {
                    const userID = user.user.uid.toString();
                    localStorage.setItem("userId", userID)
                    localStorage.setItem("email", tmpEmail)

                    console.log("Sucessfull Login :: ", userID);
                    setSpin(false)
                    window.location.href = "/admin";
                  })
                  .catch((error) => {
                    setSpin(false)
                    const errorMessage = error.message;
                    alert(errorMessage);
                  })
              } else {

                setSpin(false);
                setAlertDialog({
                  isOpen: true,
                  title: "Cordinate To Admin! For The Inactivatation.",
                });

              }
            })
          } else {

            setSpin(false);
            setAlertDialog({
              isOpen: true,
              title: "User Not Found ! Please Cordinate With Support Team !",
            });

          }


        })

      }
    }
  }

  const onUserForgot = () => {

    console.log("ON FORGOT")
    // setSpin(true)

    let tmpEmail = values.userEmail.toLowerCase();

    if (tmpEmail === "") {
      console.log("tmpEmail :: ", tmpEmail)
      // setSpin(false)
      setAlertDialog({
        isOpen: true,
        title: "Please Enter User Email-id.",
      });
    } else {

      if (!patternEmail.test(tmpEmail)) {
        // setSpin(false);
        setAlertDialog({
          isOpen: true,
          title: "Please Enter Valid Email-id.",
        });
      } else {
        firebase.auth().sendPasswordResetEmail(tmpEmail)
          .then(() => {
            // setSpin(false);
            setAlertDialog({
              isOpen: true,
              title: "Please check your email and reset password there.",
            });
          })
          .catch((error) => {

            // setSpin(false);
            setAlertDialog({
              isOpen: true,
              title: "User Not Found ! Please Enter Proper Email-id.",
            });

          });
      }

    }
  }

  const setAlertDialogfunc = () => {
    setAlertDialog({
      ...alertDialog,
      isOpen: false,
      title: "",
      subTitle: "",
    });
  };


  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Sign In
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          {/* <Button
            fontSize='sm'
            me='0px'
            mb='26px'
            py='15px'
            h='50px'
            borderRadius='16px'
            bg={googleBg}
            color={googleText}
            fontWeight='500'
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}>
            <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
            Sign in with Google
          </Button> */}
          <Flex align='center' mb='25px'>
            <HSeparator />
            {/* <Text color='gray.400' mx='14px'>
              or
            </Text> */}
            <HSeparator />
          </Flex>
          <FormControl>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='text'
              placeholder='mail@simmmple.com'
              mb='24px'
              fontWeight='500'
              size='lg'
              name="userEmail"
              value={values.userEmail}
              onChange={handleChange}
            />
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isRequired={true}
                fontSize='sm'
                placeholder='Min. 8 characters'
                mb='24px'
                size='lg'
                type={show ? "text" : "password"}
                variant='auth'
                name="password"
                value={values.password}
                onChange={handleChange}
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent='space-between' align='center' mb='24px'>
              {/* <FormControl display='flex' alignItems='center'>
                <Checkbox
                  id='remember-login'
                  colorScheme='brandScheme'
                  me='10px'
                />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  fontWeight='normal'
                  color={textColor}
                  fontSize='sm'>
                  Keep me logged in
                </FormLabel>
              </FormControl> */}
              {/* <NavLink to='/auth/forgot-password'> */}
                <Text
                  color={textColorBrand}
                  fontSize='sm'
                  w='124px'
                  fontWeight='500'
                  onClick={() => { onUserForgot() }}
                >
                  Forgot password?
                </Text>
              {/* </NavLink> */}
            </Flex>

            {(spin ? (
              <CircularProgress
                color="secondary"
                style={{ margin: "5px" }}
                size={20}
              />
            ) : (
              ""
            ))}
            <Button
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
              disabled={spin}
              onClick={() => { onUserLogin() }}
            >
              Sign In
            </Button>
          </FormControl>

          <Flex align='center' mb='25px'>
            <HSeparator />
            <HSeparator />
          </Flex>

          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              Not registered yet?
              <Text
                color={textColorBrand}
                as='span'
                ms='5px'
                fontWeight='500'>
                Contact With Administrative !
              </Text>
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <AlertDialog
        alertDialog={alertDialog}
        setAlertDialog={setAlertDialogfunc}
      />
    </DefaultAuth>
  );
}

export default SignIn;
