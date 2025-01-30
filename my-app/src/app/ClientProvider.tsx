import { Toaster } from "@/components/ui/toaster";
import StoreProvider from "./StoreProvider"
import { ToastContainer } from 'react-toastify';


const ClientProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreProvider>
            {children}
            <ToastContainer />
            <Toaster />
        </StoreProvider>
    )
}

export default ClientProvider