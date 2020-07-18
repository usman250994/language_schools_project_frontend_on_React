import React, { PropsWithChildren, createContext, useState, CSSProperties } from 'react';
import Toast from 'react-bootstrap/Toast';

type ToastType = {
  type: 'success' | 'error' | 'hide';
  message?: string;
}

type ToastContextType = React.Dispatch<React.SetStateAction<ToastType>>;

const initialState: ToastType = {
  type: 'hide',
  message: '',
};

const ToastContext = createContext<ToastContextType>((): null => null);

const ToastContextProvider = (props: PropsWithChildren<{}>): JSX.Element => {
  const [toast, setToast] = useState<ToastType>(initialState);

  const RenderToast = (): JSX.Element | null => {
    if (!toast.message) {
      return null;
    }

    const styleToast: CSSProperties = {
      position: 'fixed',
      top: 0,
      right: 0,
      zIndex: 2,
      minWidth: '250px',
      borderRadius: '10px',
      color: 'white',
      margin: '20px',
      fontSize: '15px',
    };

    return (
      <Toast
        style={{ ...styleToast }}
        delay={5000}
        autohide
        show={toast.type !== 'hide'}
        onClose={(): void => setToast({ type: 'hide' })}
      >
        <div
          className={`alert alert-${toast.type === 'error' ? 'danger' : 'success'}`}
          style={{ marginBottom: 0 }}
        >
          <strong>{toast.type === 'error' ? 'Error!' : 'Success!'}</strong>{' '}
          {toast.message}
        </div>
      </Toast>
    );
  };

  return (
    <ToastContext.Provider value={setToast}>
      <RenderToast />
      {props.children}
    </ToastContext.Provider>
  );
};

export default ToastContextProvider;
export { ToastContext };
