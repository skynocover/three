import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const url = 'http://192.168.99.162:3002';
// const url = 'http://192.168.0.113:3002';

export const socketIO = io('/');

export interface blockSettings {
  key: number;
  name: string;
  colors: number;
  num: number;
}

export interface Size {
  X: number;
  Y: number;
  Z: number;
}

interface AppContextProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  roomID: string;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
  gameState: string;
  fetch: (method: 'get' | 'post' | 'put' | 'delete', url: string, param?: any) => Promise<any>;

  handCard: string[];
  setHandCard: React.Dispatch<React.SetStateAction<string[]>>;
  modelVisiable: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  modelContent: any;
  setModelContent: React.Dispatch<any>;
  snackVisiable: boolean;
  setSnackBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  snackContent: string;
  setSnackContent: React.Dispatch<React.SetStateAction<string>>;
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  getCard: () => Promise<void>;
  regist: () => Promise<void>;

  blocks: blockSettings[];
  setBlocks: React.Dispatch<React.SetStateAction<blockSettings[]>>;
  size: Size;
  setSize: React.Dispatch<React.SetStateAction<Size>>;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  remove: number[][];
  setRomove: React.Dispatch<React.SetStateAction<number[][]>>;
}

export const blockColor = () => _blockColor;

const _blockColor: number[] = [];

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}
const initSetting: blockSettings[] = [
  { key: 0, name: 'ground', colors: 0x68311d, num: 18 },
  { key: 1, name: 'grey', colors: 0x918881, num: 14 },
  { key: 2, name: 'sand', colors: 0xe4cb89, num: 12 },
  // { key: 3, name: 'black', colors: 0x1b1612, num: 10 },
  { key: 4, name: 'green', colors: 0x0f6421, num: 10 },
];

const AppProvider = ({ children }: AppProviderProps) => {
  const [name, setName] = React.useState<string>('');

  const [roomID, setRoomID] = React.useState<string>('none');
  const [gameState, setGameState] = React.useState<string>('beforeStart');

  const [blocks, setBlocks] = React.useState<blockSettings[]>(initSetting);
  const [size, setSize] = React.useState<Size>({ X: 3, Y: 3, Z: 3 });
  // const [size, setSize] = React.useState<Size>({ X: 4, Y: 4, Z: 4 });

  const [handCard, setHandCard] = React.useState<string[]>([]);

  const [modelVisiable, setModalVisible] = React.useState<boolean>(false);
  const [modelContent, setModelContent] = React.useState<any>(null);

  const [snackVisiable, setSnackBarVisible] = React.useState<boolean>(false);
  const [snackContent, setSnackContent] = React.useState<string>('');

  const [login, setLogin] = React.useState<boolean>(false);

  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [remove, setRomove] = React.useState<number[][]>([]);

  /////////////////////////////////////////////////////

  React.useEffect(() => {
    axios.defaults.baseURL = '';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    // let blockColor: number[] = [];
    for (const s of blocks) {
      for (let i = 0; i < s.num; i++) {
        _blockColor.push(s.colors);
      }
    }
    shuffle(_blockColor);
  }, []);

  const fetch = async (method: 'get' | 'post' | 'put' | 'delete', url: string, param?: any) => {
    let data: any = null;

    try {
      const response = await axios({
        method,
        url,
        data: param,
      });
      console.log(`API ${url} response: ${JSON.stringify(response.data)}`);

      if (response.data.errorCode !== 0) {
        throw new Error(response.data.errorMessage);
      }

      data = response.data;
    } catch (error) {
      //   Alert.alert('fail', `code: ${error.code}, message: ${error.message}`);
    }

    return data;
  };

  const getCard = async () => {
    let data = await fetch('post', '/api/game/getCard', {
      id: socketIO.id,
      roomID: roomID,
    });
    if (data) {
      setHandCard((prevState: string[]) => {
        let newhandCard = [...data.handCard];
        console.log('after get card', newhandCard);
        return [...data.handCard];
      });
    }
  };

  const regist = async () => {
    if (name === '') {
      //   Alert.alert('請輸入使用者名稱');
      return;
    }
    let data = await fetch('post', '/api/players', {
      player: { id: socketIO.id, name: name },
    });
    if (data) {
      setLogin(true);
    }
  };

  /////////////////////////////////////////////////////

  return (
    <AppContext.Provider
      value={{
        name,
        setName,
        roomID,
        setRoomID,
        gameState,
        fetch,

        handCard,
        setHandCard,

        modelVisiable,
        setModalVisible,
        modelContent,
        setModelContent,

        snackVisiable,
        setSnackBarVisible,
        snackContent,
        setSnackContent,
        login,
        setLogin,
        getCard,
        regist,

        blocks,
        setBlocks,
        size,
        setSize,

        refresh,
        setRefresh,

        remove,
        setRomove,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };

// Fisher-Yates ...
function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
