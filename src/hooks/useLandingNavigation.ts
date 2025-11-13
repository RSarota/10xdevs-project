/**
 * Hook dla nawigacji w LandingPage
 */
export function useLandingNavigation() {
  const handleLogin = () => {
    window.location.href = "/auth/login";
  };

  const handleRegister = () => {
    window.location.href = "/auth/register";
  };

  return {
    handleLogin,
    handleRegister,
  };
}
