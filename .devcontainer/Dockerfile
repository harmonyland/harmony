FROM denoland/deno:1.12.2

RUN apt-get -y update
RUN apt-get -y install git

RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.1/zsh-in-docker.sh)"

RUN deno install -qAn vr https://deno.land/x/velociraptor@1.1.0/cli.ts
