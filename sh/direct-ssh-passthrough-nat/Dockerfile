FROM ubuntu
RUN apt update && \
    apt install -y ssh wget && \
    apt clean all && rm -rvf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /
ARG WORK_PATH=/
ARG FRP_VERSION=0.67.0-0
ARG PLATFORM=amd64
ARG FRP_PATH=/usr/local/src/qemu
ARG TARGET_FRP_NAME=qemu

ARG FILE_NAME=frp_${FRP_VERSION}_linux_${PLATFORM}


RUN wget -P ${WORK_PATH} https://gitee.com/lsjnb666/frp/releases/download/v${FRP_VERSION}/${FILE_NAME}.tar.gz -O ${FILE_NAME}.tar.gz && \
    tar -zxvf ${FILE_NAME}.tar.gz && \
    mkdir -pv ${FRP_PATH} && \
    mv ${FILE_NAME}/frpc ${FRP_PATH}/${TARGET_FRP_NAME} && \
    rm -rvf ${WORK_PATH}/${FILE_NAME}.tar.gz

RUN sed -i 's/^#PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    mkdir /var/run/sshd/

ADD entrypoint.sh /
ENTRYPOINT [ "/entrypoint.sh" ]