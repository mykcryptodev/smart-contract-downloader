import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const getContractSourceCode = async (
  apiKey,
  network,
  contractAddress
) => {
  const networkRequests = {
    mainnet: `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`,
    rinkeby: `https://api-rinkeby.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`,
    ropsten: `https://api-ropsten.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`,
    kovan: `https://api-kovan.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`,
    goerli: `https://api-goerli.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`,
    bsc: `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`,
    bscTest: `https://api-testnet.bscscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`,
  };
  return await axios.get(networkRequests[network]);
};

export const parseSourceCodeObject = (sourceCode) => {
  return JSON.parse(sourceCode.substr(1, sourceCode.length - 2));
};

export const getContractContentList = (sourceCodes) => {
  const contractContent = [];
  // is array?
  for (const sourceCode of sourceCodes) {
    const parsedSourceCode = parseSourceCodeObject(sourceCode.SourceCode);
    const sourceObjects = Object.entries(parsedSourceCode.sources).map(
      (sourceObject) => {
        return {
          path: sourceObject[0],
          content: sourceObject[1].content,
        };
      }
    );
    contractContent.push(...sourceObjects);
  }
  return contractContent;
};

export const exportContractContentsToZip = (
  contractContents,
  contractAddress
) => {
  var zip = new JSZip();
  for (const contractContent of contractContents) {
    zip.file(contractContent.path, contractContent.content);
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, `contract_${contractAddress}.zip`);
  });
};

export const copyToClipboard = (data) => {
  navigator.clipboard.writeText(data);
};