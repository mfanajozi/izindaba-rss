export const timezone = {
  getSASTTime(): Date {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (2 * 3600000));
  },

  formatSASTTime(): string {
    const sast = this.getSASTTime();
    return sast.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  },

  formatSASTDate(): string {
    const sast = this.getSASTTime();
    return sast.toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  getSASTHours(): number {
    return this.getSASTTime().getHours();
  },

  getSASTMinutes(): number {
    return this.getSASTTime().getMinutes();
  },
};