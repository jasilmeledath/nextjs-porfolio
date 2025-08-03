import { useState, useEffect } from 'react';

const useSubscriptionModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if user has already been shown the modal or is subscribed
        const modalShown = localStorage.getItem('subscriptionModalShown');
        const userSubscribed = localStorage.getItem('userSubscribed');
        
        if (modalShown || userSubscribed) {
            setHasShown(true);
            return;
        }

        // Show modal after user has been on the page for 30 seconds
        // and scrolled at least 50% of the page
        let scrollTimer;
        let timeTimer;
        let hasScrolled50Percent = false;
        let has30SecondsElapsed = false;

        const checkScroll = () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrolled >= 50 && !hasScrolled50Percent) {
                hasScrolled50Percent = true;
                checkConditions();
            }
        };

        const checkConditions = () => {
            if (hasScrolled50Percent && has30SecondsElapsed && !hasShown) {
                setShowModal(true);
                setHasShown(true);
                // Mark that modal has been shown
                localStorage.setItem('subscriptionModalShown', 'true');
                
                // Remove event listeners
                window.removeEventListener('scroll', checkScroll);
                clearTimeout(timeTimer);
            }
        };

        // Set up scroll listener
        window.addEventListener('scroll', checkScroll);

        // Set up timer for 30 seconds
        timeTimer = setTimeout(() => {
            has30SecondsElapsed = true;
            checkConditions();
        }, 30000); // 30 seconds

        // Cleanup
        return () => {
            window.removeEventListener('scroll', checkScroll);
            clearTimeout(timeTimer);
        };
    }, [hasShown]);

    const closeModal = () => {
        setShowModal(false);
    };

    const markUserSubscribed = () => {
        localStorage.setItem('userSubscribed', 'true');
        setShowModal(false);
    };

    const resetModal = () => {
        localStorage.removeItem('subscriptionModalShown');
        localStorage.removeItem('userSubscribed');
        setHasShown(false);
        setShowModal(false);
    };

    return {
        showModal,
        closeModal,
        markUserSubscribed,
        resetModal // For testing purposes
    };
};

export default useSubscriptionModal;
