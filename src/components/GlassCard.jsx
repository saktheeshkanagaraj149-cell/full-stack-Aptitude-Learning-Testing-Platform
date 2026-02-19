export default function GlassCard({ children, className = '', hover = false, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`${hover ? 'glass-card-hover cursor-pointer' : 'glass-card'} p-6 ${className}`}
        >
            {children}
        </div>
    );
}
