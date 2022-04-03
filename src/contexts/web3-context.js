import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { useMoralis } from "react-moralis";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
  ...initialState,
  platform: "WEB3",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
  const {
    isWeb3Enabled,
    enableWeb3,
    isWeb3EnableLoading,
    user,
    isAuthenticated,
    authenticate,
    Moralis,
    logout: moralisLogout,
  } = useMoralis();
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log(user)
    
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) 
      enableWeb3();
    
      
    const initialize = async () => {
      try {
        //const accessToken = window.localStorage.getItem('accessToken');
        
        console.log('Are we Authenticated', isAuthenticated)
        if (isAuthenticated) {
          //const user = await authApi.me(accessToken);
          
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, [enableWeb3, isAuthenticated, isWeb3EnableLoading, isWeb3Enabled, user]);

  const login = async () => {
    try {
      console.log("in login");
      const user = await authenticate({
        provider: "web3Auth",
        clientId:
          "BLuDPW99wB8XTXO6rdq40viKddD2A2plHbz2aq3j00pPuBByzS3qvvo2cdFPT7xnPv7-OIm2yiZRCBHjSiGjBIo",
      });
      
      console.log(user)
      window.localStorage.setItem("connectorId", "web3Auth");

      dispatch({
        type: "LOGIN",
        payload: {
          user,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    await moralisLogout();
    window.localStorage.removeItem("connectorId");
    dispatch({ type: "LOGOUT" });
  };

  const register = async (email, name, password) => {
    const accessToken = await authApi.register({ email, name, password });
    const user = await authApi.me(accessToken);

    localStorage.setItem("accessToken", accessToken);

    dispatch({
      type: "REGISTER",
      payload: {
        user,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: "WEB3",
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;
