FROM hoosin/alpine-nginx-nodejs

ENV APP_ROOT /home/pethernet-app
ENV SRC_DIR ./node_modules ./public ./src
ENV NGINX_STATIC /usr/share/nginx/html/
ENV NGINX_CONF /etc/nginx/

# App env variables
ENV DB_CONNECTION_STRING=mongodb+srv://phatngluu:IP0VYjuHWPgMSodz@cluster0.vv0ri.mongodb.net/pethernetdb3?retryWrites=true&w=majority
ENV SERVER_PORT=5000
ENV SESSION_SECRET=MySuperCoolAndAwesomeSecretForSigningSessionCookies

ENV PETHERNET_URI=http://127.0.0.1:8545
ENV PETHERNET_CONTRACT_ADDRESS=0xbF87Dbd03d06eBa018464c5A20F14Df402A3864f
ENV MINISTRY_OF_HEALTH_ADDRESS=0x306aC74f0DB83cCaFE4525f09789b58491e792C8
ENV PETHERNET_SYSTEM_ADDRESS=0x306aC74f0DB83cCaFE4525f09789b58491e792C8
ENV MEDICAL_UNIT_1=0x4aAFcb5c9B0f4Bb3484312668ec573C5FF5bA8B7

WORKDIR $APP_ROOT
COPY . $APP_ROOT

RUN node -v \
    && npm -v
RUN npm install
RUN cp -r dist/sixtyfiver-app/* $NGINX_STATIC
RUN cp -r nginx/* $NGINX_CONF

EXPOSE 8080
CMD ["npm", "run", "start"]