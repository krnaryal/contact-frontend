import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useStore from "../store/store";

const withAuth = (WrappedComponent) => {
  const RequiresAuthentication = (props) => {
    const { isLoggedIn } = useStore();
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn) router.push(`/login`);
    }, [isLoggedIn]);

    return isLoggedIn ? <WrappedComponent {...props} /> : <></>;
  };
  return RequiresAuthentication;
};

export default withAuth;
