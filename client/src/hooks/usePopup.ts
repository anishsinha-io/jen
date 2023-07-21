import { useState, useEffect } from "react";

const usePopup = (popupRef: any) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);

    useEffect(() => {
        const handleDocumentClick = (e: any) => {
            const clicked = e.target;
            if (!popupRef?.current?.contains(clicked)) setShowPopup(() => false);
        };
        document.addEventListener("click", handleDocumentClick);
        return () => document.removeEventListener("click", handleDocumentClick);
    }, []);

    return [showPopup, setShowPopup];
};

export default usePopup;