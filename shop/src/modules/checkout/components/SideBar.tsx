import TotalSideBar from "@/common/components/sidebar/TotalSideBar";
import { useActions } from "@/store/actions";
import { RootState } from "@/store/store";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CheckoutEnd from "@/modules/checkout/modal/CheckoutEnd";
import { useNavigate } from "react-router-dom";

const SideBar = memo(() => {
    const {
        type,
        pickup,
        products,
    } = useSelector((state: RootState) => state.order);
    const errorsUser = useSelector((state: RootState) => state.user.errors);
    const errorsAddress = useSelector((state: RootState) => state.address.isValid);

    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    const { t } = useTranslation();

    const TotalPrice = () => {
        return products.reduce((total, item) =>
            total + item.price * item.quantity,
            type === 'Pickup' ? 0 : 1299
        );
    };

    const {
        clearFormUser,
        clearForm,
        clearCart,
        clearAddress,
    } = useActions();

    const handleBuyAll = () => {
        setIsOpen(true);
    };

    const onOk = () => {
        setIsOpen(false);
        setTimeout(()=>{
            navigate('/qpick/catalog');
        }, 0)
        clearCart();
        clearForm();
        clearFormUser();
        clearAddress();
    };

    function isValid() {
        const hasErrors = Object.values(errorsUser).some(error => error !== undefined);
        if (hasErrors) {
            return false;
        }

        if ((type === 'Delivery' && !errorsAddress) || (type === 'Pickup' && !pickup?.length)) {
            return false;
        }

        return true;
    };

    return (
        <>
            <TotalSideBar
                price={TotalPrice()}
                text={t('buyAll')}
                onClick={handleBuyAll}
                disabled={!isValid()}
            />
            <CheckoutEnd
                isOpen={isOpen}
                onOk={onOk}
            />
        </>
    )
});

export default SideBar;