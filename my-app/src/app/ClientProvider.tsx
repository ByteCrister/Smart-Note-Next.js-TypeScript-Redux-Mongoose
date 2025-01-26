import StoreProvider from "./StoreProvider"
import { ToastContainer } from 'react-toastify';


const ClientProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreProvider>
            {children}
            <ToastContainer />
        </StoreProvider>
    )
}

export default ClientProvider