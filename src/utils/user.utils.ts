export const isValidInputPassword = (password: string): boolean => {
  if (typeof password !== 'string' || password.length < 8) return false;
  let haveNumber = false;
  let haveLower = false;
  let haveUpper = false;
  let haveSpecial = false;
  password.split('').forEach((char) => {
    if (char >= '0' && char <= '9') haveNumber = true;
    else if (char >= 'a' && char <= 'z') haveLower = true;
    else if (char >= 'A' && char <= 'Z') haveUpper = true;
    else haveSpecial = true;
  });
  return haveNumber && haveLower && haveUpper && haveSpecial;
};

export const isBot = (userAgent: string = ''): boolean => {
  const bots = [
    'Googlebot',
    'Bingbot',
    'Slurp',
    'DuckDuckBot',
    'Baiduspider',
    'YandexBot',
    'Sogou',
    'Exabot',
    'facebot',
    'facebookexternalhit',
    'ia_archiver'
  ];
  return bots.some((bot) => userAgent.toLowerCase().includes(bot.toLowerCase()));
};
