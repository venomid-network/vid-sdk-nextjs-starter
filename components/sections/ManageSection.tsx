import React, { useEffect, useState } from 'react';
import {
  BaseNftJson,
  getAddressesFromIndex,
  getNftByIndex,
  saltCode,
} from '../../core/utils/nft';
import NextLink from 'next/link';
import {
  Button,
  Container,
  Text,
  Stack,
  Box,
  Tooltip,
  Center,
  Flex,
  Link,
  useMediaQuery,
  useColorMode,
  Spinner,
  HStack,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { useConnect, useVenomProvider } from 'venom-react-hooks';
import {
  primaryNameAtom,
  ipfsGatewayAtom,
  networkAtom,
} from '../../core/atoms';
import { useAtom, useAtomValue } from 'jotai';
import {
  ROOT_CONTRACT_ADDRESS,
  SITE_PROFILE_URL,
} from '../../core/utils/constants';
import {
  RiRestartLine,
} from 'react-icons/ri';
import { MdOutlinePreview, MdOutlineVisibility } from 'react-icons/md';
import axios from 'axios';
import { useAddress } from '@thirdweb-dev/react';
import { createWeb3Name } from '@web3-name-sdk/core';
import { useRouter } from 'next/router';
import { sleep } from '../../core/utils';
import Avatar from '../Profile/Avatar';
import { ConnectButton } from '../venomConnect';
import { useTranslate } from '../../core/lib/hooks/use-translate';

function ManageSection() {
  const { provider } = useVenomProvider();
  const { isConnected, account } = useConnect();
  const ethAddress = useAddress();
  const [_ethAddress, _setEthAddress] = useState(ethAddress);
  const [listIsEmpty, setListIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [names, setNames] = useState<string[]>();
  const [loaded, setLoaded] = useState(false);
  const [nftjsons, setNftJsons] = useState<BaseNftJson[] | undefined>(undefined);
  const network = useAtomValue(networkAtom);
  const [_network, _setNetwork] = useState(network);
  const { t } = useTranslate();
  const ipfsGateway = useAtomValue(ipfsGatewayAtom);
  const [primaryName, setPrimaryName] = useAtom(primaryNameAtom);
  const [notMobile] = useMediaQuery('(min-width: 800px)');
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const [isConfirming, setIsConfirming] = useState(false);
  const minFee = 660000000;
  const { colorMode } = useColorMode();
  const web3Name = createWeb3Name();
  const { pathname } = useRouter();

  const loadByContract = async (_contractAddress: string) => {
    if (!provider || !provider.isInitialized) return;
    setIsLoading(true);
    setNames([]);
    const saltedCode = await saltCode(provider, String(account?.address), _contractAddress);
    // Hash it
    const codeHash = await provider.getBocHash(String(saltedCode));
    if (!codeHash) {
      //setIsLoading(false);
      return;
    }
    // Fetch all Indexes by hash
    const indexesAddresses = await getAddressesFromIndex(codeHash, provider);
    if (!indexesAddresses || !indexesAddresses.length) {
      //setIsLoading(false);
      return;
    }
    // Fetch all nfts
    indexesAddresses.map(async (indexAddress) => {
      try {
        let _nftJson = await getNftByIndex(provider, indexAddress);
        if (_contractAddress !== ROOT_CONTRACT_ADDRESS) {
          const ipfsData = _nftJson.attributes?.find(
            (att: any) => att.trait_type === 'DATA'
          )?.value;
          if (ipfsData !== '' && ipfsData) {
            const res = await axios.get(ipfsGateway + ipfsData);
            if (res) {
              _nftJson.avatar = res.data.avatar ?? ''; //_nftJson.preview?.source;
            } else {
              _nftJson.avatar = ''; //_nftJson.preview?.source;
            }
          } else {
            _nftJson.avatar = ''; //_nftJson.preview?.source;
          }
        } else {
          const ipfsData = _nftJson.hash;
          if (!ipfsData?.includes('not set') && ipfsData) {
            const res = await axios.get(ipfsGateway + ipfsData);
            if (res) {
              _nftJson.avatar = res.data.avatar ?? ''; //_nftJson.preview?.source;
            } else {
              _nftJson.avatar = ''; //_nftJson.preview?.source;
            }
          } else {
            _nftJson.avatar = ''; //_nftJson.preview?.source;
          }
        }
        if (_contractAddress === ROOT_CONTRACT_ADDRESS) {
          setNames((n) => [...(n ? n : []), String(_nftJson.name)])
          _nftJson.manageUrl = '/manage/' + _nftJson.address;
        } else {
          _nftJson.manageUrl = '/oldManage/' + _nftJson.address;
          _nftJson.external_url = `${SITE_PROFILE_URL}o/${_nftJson.name}` 
        }
        _nftJson.network = 'venom';
        setNftJsons((nfts) => [...(nfts ? nfts : []), _nftJson]);

      } catch (e: any) {
        // console.log('error getting venomid nft ', indexAddress);
      }
    });
  };

  const loadVenomNFTs = async () => {
    try {
      // Take a salted code
      // console.log('loading all nfts', account?.address);
      if (!provider?.isInitialized) return;
      setNftJsons([]);
      setIsLoading(true);
      setListIsEmpty(false);
      await loadByContract(ROOT_CONTRACT_ADDRESS);
      setLoaded(true);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const loadEthNFTs = async () => {
    try {
      // Take a salted code
      // console.log('loading all nfts', account?.address);
      if (!ethAddress) return;
      setNftJsons([]);
      setIsLoading(true);
      setListIsEmpty(false);

      const nfts = await web3Name.getDomainNames({ address: ethAddress });
      console.log(ethAddress, nfts);

      nfts.map(async (nft: any) => {
        try {
          //let r = await web3Name.getDomainRecord({name: nft});
          let _avatar = await web3Name.getDomainRecord({ name: nft, key: 'avatar' });
          let _name = await web3Name.getDomainRecord({ name: nft, key: 'name' });
          let _nftJson: BaseNftJson = { name: nft, avatar: _avatar ?? '', address: nft };
          //_nftJson.ipfsData = _venomid;
          _nftJson.address = nft; //_nftJson.preview?.source;
          _nftJson.network = nft.slice(nft.indexOf('.') + 1); //_nftJson.preview?.source;
          _nftJson.external_url = SITE_PROFILE_URL + 'sid/' + _nftJson.name;
          _nftJson.manageUrl = '/managesid/' + _nftJson.address;
          console.log(_nftJson);
          setNftJsons((nfts) => [...(nfts ? nfts : []), _nftJson]);
        } catch (e: any) {
          // console.log('error getting venomid nft ', indexAddress);
        }
      });

      setLoaded(true);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (nftjsons?.length === 0 && loaded) {
      setListIsEmpty(true);
    } else {
      setListIsEmpty(false);
    }
  }, [nftjsons]);

  useEffect(() => {
    async function getNfts() {
      if (account && isConnected && provider) {
        if (!provider?.isInitialized) {
          // console.log('provider not ready');
          await sleep(1000);
          getNfts();
          return;
        }

        if (!loaded || network !== _network || ethAddress !== _ethAddress) {
          console.log(network);
          if (network === 'venom') {
            loadVenomNFTs();
          } else {
            loadEthNFTs();
          }
          _setNetwork(network);
          _setEthAddress(ethAddress);
        }
      }

      if (!isConnected) setNftJsons([]);
    }
    getNfts();
  }, [isConnected, provider, network, ethAddress]);

  
  return (
    <Box>
      <Container
        as="main"
        maxW="container.lg"
        display="grid"
        flexDir={'column'}
        minH={'100vh'}
        flexGrow={1}>
        <Box py={6} gap={2} width={'100%'} pb={12}>
          {isConnected && (
            <Stack gap={10} width={'100%'} my={4}>
              <Flex minWidth={['350px', '420px', '580px', '800px']} align={'center'} height={'64px'} gap={3}>
                <Text
                  flexGrow={1}
                  fontWeight="bold"
                  fontSize={notMobile ? '4xl' : '2xl'}
                  my={notMobile ? 10 : 4}>
                  {network === 'venom' ? pathname.includes('old') ? t('yourOldVids') : t('yourVids') : t('yourSids')}
                </Text>
               
                <Button
                  aria-label="reload-nfts"
                  key={`reload-${network}-nfts`}
                  rounded={'full'}
                  size={'lg'}
                  onClick={network === 'venom' ? loadVenomNFTs : loadEthNFTs}
                  gap={2}>
                  {notMobile ? 'Reload' : ''} <RiRestartLine size={'24'} />
                </Button>
              </Flex>
              {isLoading && (
                <Center width={'100%'} height={200}>
                  <Spinner size="lg" />
                </Center>
              )}
            </Stack>
          )}

          <Stack gap={2} width={'100%'}>
            {nftjsons?.map((nft) => (
              <Flex
                key={nft.name}
                flexDirection={'row'}
                gap={2}
                minWidth={['100%', '420px', '580px', '800px']}
                height={['64px','64px','72px']}
                alignItems={'center'}
                background={colorMode === 'dark' ? 'blackAlpha.300' : 'white'}
                borderColor={
                  nft?.name !== undefined && primaryName.name === nft?.name.slice(0, -4)
                    ? 'grey'
                    : 'blackAlpha.200'
                }
                borderWidth={1}
                p={2}
                rounded={'full'}>
                <Flex gap={3} flexGrow={1} w={'100%'}>
                  <Box width={['48px','48px','56px']} key={nft.name + '-box-name'}>
                    <Avatar
                      my={'0px'}
                      noanimate
                      nodrag
                      alt={nft.name}
                      shadow="none"
                      url={String(nft.avatar)}
                      shape="circle"
                    />
                  </Box>
                  <HStack><Box flexGrow={1} fontWeight={'bold'} fontSize={['xl', 'xl', '2xl']}>
                  {String(nft.name).toLowerCase()}
                </Box></HStack>
                </Flex>
                  
                  <Flex gap={2} align={'center'}>
                
                    <Link href={nft.external_url} target="_blank">
                      <Tooltip
                        borderRadius={4}
                        label={
                          <Text p={2}>
                            View {nft.network === 'venom' ? 'Venom ID Link' : 'Space ID Link'}
                          </Text>
                        }
                        hasArrow
                        color="white"
                        bgColor={'black'}>
                        <IconButton
                          aria-label="view-venom-id"
                          variant={'outline'}
                          rounded={'full'}
                          size={'lg'}
                          colorScheme="gray">
                          <MdOutlineVisibility />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  </Flex>
                
              </Flex>
            ))}
          </Stack>

          {listIsEmpty && !isLoading && (
            <Center display="flex" flexDirection="column" gap={4} minH={'75%'}>
              <Text fontSize="xl">You don't own any {pathname.includes('old') ? ' old ' : ''} Venom IDs</Text>
              <NextLink href={'/'} passHref>
                <Button
                  variant="outline"
                  textAlign="left"
                  borderWidth={1}
                  gap={2}
                  borderColor="grey">
                  Claim Your Venom ID
                </Button>
              </NextLink>
            </Center>
          )}
        </Box>
        {!network && (
          <Center my={8} flexDirection="column" minH={'75vh'}>
            <Text my={4}>{t('venomWalletConnect')}</Text>
            <ConnectButton />
          </Center>
        )}
      </Container>
    </Box>
  );
}

export default ManageSection;
