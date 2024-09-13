export const Clock = ({ duration }) => {
    const getFillStyle = (duration) => {
      const totalMinutes = 60; // Total duration in minutes
      const fillPercent = (duration / totalMinutes) * 100;
  
      return {
        background: `conic-gradient(
          whitesmoke 0% ${fillPercent}%, 
          transparent ${fillPercent}% 100%
        )`,
      };
    };
  
    return (
      <div className="clock">
        <div className="clock-fill" style={getFillStyle(duration)} />
      </div>
    );
  };