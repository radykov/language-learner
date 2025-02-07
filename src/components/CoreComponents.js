// Accordion.jsx (Reusable Accordion Component)
export const Accordion = ({ title, subtitle, children, isOpen, toggle }) => {
    return (
        <div className="accordion">
            <button className="accordion-header" onClick={toggle}>
                <div className="accordion-title">
                    <h3>{title}</h3>
                    {subtitle && <p className="accordion-subtitle">{subtitle}</p>}
                </div>
                <span className="accordion-arrow">{isOpen ? '▼' : '▶'}</span>
            </button>
            {isOpen && <div className="accordion-content">{children}</div>}
        </div>
    );
};

// TextField.jsx (Reusable Input Component)
export const TextField = ({ label, value, onChange, type = 'text', placeholder, multiline, rows = 4 }) => {
    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="text-input"
                    placeholder={placeholder}
                    rows={rows}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="text-input"
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};

// Button.jsx (Reusable Button Component)
export const Button = ({ children, onClick, variant = 'primary', disabled = false }) => {
    return (
        <button
            className={`button ${variant}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

// ErrorMessage.jsx (Reusable Error Message Component)
export const ErrorMessage = ({ message }) => {
    return (
        <div style={{
            border: '2px solid red',
            padding: '20px',
            margin: '20px',
            borderRadius: '4px',
            backgroundColor: '#ffebee'
        }}>
            <p style={{ color: '#d32f2f', margin: 0 }}>
                {message}
            </p>
        </div>
    );
};

// WarningMessage.jsx (Reusable Warning Message Component)
export const WarningMessage = ({ message }) => {
    return (
        <div style={{ 
            padding: '12px 16px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeeba',
            borderRadius: '4px',
            color: '#856404',
            marginBottom: '1.5rem',
            fontSize: '0.95rem'
        }}>
            {message}
        </div>
    );
};

// ApiKeyCheck.jsx (Reusable API Key Check Component)
export const ApiKeyCheck = () => {
    if (!process.env.REACT_APP_GEN_AI_API_KEY?.trim()) {
        return <ErrorMessage message="This only works if you run this locally and specify a Gen AI API key in code. Please read the readme.md for instructions" />;
    }
    return null;
};