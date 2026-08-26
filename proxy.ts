import withAuth from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized: ({ token }) => Boolean(
      token?.sub &&
      typeof token.sitzungVersion === "number" &&
      !token.ungueltig,
    ),
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
