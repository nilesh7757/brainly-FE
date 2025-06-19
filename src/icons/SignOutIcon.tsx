const SignOutIcon = ({ className = '' }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Log out icon: arrow pointing right out of a door */}
    <path
      d="M16 17l5-5m0 0l-5-5m5 5H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 12H9m0 0V7a2 2 0 00-2-2h-3a2 2 0 00-2 2v10a2 2 0 002 2h3a2 2 0 002-2v-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SignOutIcon; 