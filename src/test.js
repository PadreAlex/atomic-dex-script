const getitAdScript = {
    encryptApi: (str, key) => {
        let encrypted = "";
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            const encryptedCharCode = Math.floor((charCode + key) % 256);
            encrypted += String.fromCharCode(encryptedCharCode);
        }
        return encrypted;
    },

    getImage: async (params, isMobile) => {
        const ts = Date.now().toString();
        const api_key = getitAdScript.encryptApi(params.apiKey, 26);
        const response = await fetch("https://v1.getittech.io/v1/ads/get_ad", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                wallet_address: params.walletConnected,
                timestamp: ts,
                api_key,
                image_type: isMobile ? "MOBILE" : "DESKTOP",
                page_name: window.location.pathname,
                slot_id: params.slotId,
            }),
        });
        const data = await response.json();
        return data;
    },

    generateUrl: async (params, campaign_uuid, banner_uuid) => {
        const ts = Date.now().toString();
        const api_key = getitAdScript.encryptApi(params.apiKey, 26);
        await fetch("https://v1.getittech.io/v1/utm/event", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                api_key,
                timestamp: ts,
                campaign_uuid,
                wallet_address: params.walletConnected,
                event_type: "CLICK",
                page_name: window.location.pathname,
                slot_id: params.slotId,
                banner_uuid: banner_uuid ? banner_uuid : "0000-0000-0000-0000",
            }),
        });
    },

    OS: {
        win: "Win64",
        iPhone: "iPhone",
        android: "Android",
    },

    getUserDevice: () => {
        const ua = navigator.userAgent;

        if (
            ua.toLowerCase().includes(getitAdScript.OS.iPhone.toLowerCase()) ||
            ua.toLowerCase().includes(getitAdScript.OS.android.toLowerCase())
        ) {
            return true;
        }

        return false;
    },

    getCountry: async () => {
        const response = await fetch("https://ipapi.co/json/");
        const locationData = await response.json();
        const countryIso2 = locationData.country;
        return countryIso2;
    },

    renderAdPlugin: async (props, containerId) => {
        const isMobile = getitAdScript.getUserDevice();
        const walletMetamask = await window.ethereum.request({
            method: "eth_accounts"
        })
        props.walletConnected = walletMetamask[0] ? walletMetamask[0] : props.walletConnected
        const data = await getitAdScript.getImage(props, isMobile);
        if (!data) {
            return;
        }

        const adContainer = document.getElementById(containerId);
        if (!adContainer) {
            console.error("Container element not found.");
            return;
        }

        adContainer.style.margin = "auto";
        adContainer.style.justifyContent = "center";
        adContainer.style.display = "flex";
        adContainer.style.height = "90px";
        adContainer.style.width = isMobile ? "270px" : "728px";

        const adImageContainer = document.createElement("div");
        adImageContainer.style.margin = "0";
        adImageContainer.style.backgroundColor = "black";
        adImageContainer.style.alignSelf = "center";
        adImageContainer.style.marginLeft = "auto";
        adImageContainer.style.marginRight = "auto";
        adImageContainer.style.borderRadius = "10px";

        const adLink = document.createElement("a");
        adLink.href =
            data.redirect_link +
            "?utm_campaign=" +
            data.campaign_name +
            "&" +
            "utm_content=" +
            data.banner_name +
            "&" +
            "utm_source=" +
            'getit'

        adLink.target = "_blank"
        adLink.rel = 'noreferrer'
        adLink.style.cursor = "pointer";
        adLink.onclick = async () => {
            await getitAdScript.generateUrl(props, data.campaign_uuid, data.banner_uuid);
        };

        const adImage = document.createElement("img");
        adImage.style.maxWidth = "100%";
        adImage.style.maxHeight = "100%";
        adImage.style.verticalAlign = "middle";
        adImage.style.borderRadius = "10px";
        adImage.style.overflowClipMargin = "content-box";
        adImage.style.overflow = "clip";
        adImage.src = data.image_url;

        adLink.appendChild(adImage);
        adImageContainer.appendChild(adLink);
        adContainer.appendChild(adImageContainer);
    }

};

window.getitAdScript = getitAdScript;