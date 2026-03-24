import { motion } from "framer-motion";

interface SystemMessageProps {
  content: string;
}

const SystemMessage = ({ content }: SystemMessageProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex justify-center py-1"
  >
    <span className="rounded-full bg-muted px-3 py-1 text-xs text-system">
      {content}
    </span>
  </motion.div>
);

export default SystemMessage;
