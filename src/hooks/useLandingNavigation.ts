/**
 * Hook dla nawigacji w LandingPage
 */
export function useLandingNavigation(isAuthenticated: boolean) {
  const handleLogin = () => {
    window.location.href = "/auth/login";
  };

  const handleRegister = () => {
    window.location.href = "/auth/register";
  };

  const handleDemo = () => {
    if (isAuthenticated) {
      window.location.href = "/generate-flashcards";
    } else {
      window.location.href = "/auth/register";
    }
  };

  const handleGoToApp = () => {
    window.location.href = "/dashboard";
  };

  return {
    handleLogin,
    handleRegister,
    handleDemo,
    handleGoToApp,
  };
}
