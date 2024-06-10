/* eslint-disable */
import React from "react";

// Chakra imports
import { Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";

// Custom components
// import { HorizonLogo } from "components/icons/Icons";
import logoWhite from "assets/img/layout/logoWhite.png";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      {/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      {/* <Image src={logoWhite} w='75px' h='75px' /> */}
      <Text
        fontSize={{ base: "lg", xl: "18px" }}
        color={logoColor}
        fontWeight='bold'
        lineHeight='150%'
        textAlign='center'
        px='10px'
        mt="10px"
        mb='6px'>
        માં અન્નપૂર્ણા
      </Text>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
