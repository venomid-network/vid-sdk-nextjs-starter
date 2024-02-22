import { Box, Container, Link, Text, useColorModeValue } from '@chakra-ui/react';

export default function Foot() {
  return (
    <>
    <Box w="full" py={5} backgroundColor={'blackAlpha.200'}>
      <Container flexDirection={'column'} maxW="container.lg" alignItems={'center'} display="flex" justifyContent="center" gap={4}>
       
        <Text>2023 © Venom ID</Text>

      </Container>
    </Box>
    </>
  );
}
