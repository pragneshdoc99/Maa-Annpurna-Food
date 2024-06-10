/* eslint-disable */
import { Box, SimpleGrid } from "@chakra-ui/react";
import TableListTable from "views/admin/TableList/components/TableListTable";
import React from "react";

export default function Settings() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        // columns={{ sm: 1, md: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <TableListTable />
      </SimpleGrid>
    </Box>
  );
}
