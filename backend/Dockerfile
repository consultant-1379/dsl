FROM node:10.15-stretch

# Symlink is a fix for dependency mismatch
RUN apt-get update --fix-missing && \
    apt-get -y upgrade && \
    apt-get install -y \
    build-essential \
    libssl-dev && \
    ln -s /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1 /usr/lib/x86_64-linux-gnu/libcrypto.so.1.0

WORKDIR /usr/app
COPY . .
EXPOSE 3000
ENTRYPOINT ["/usr/app/wait-for-token.sh"]
