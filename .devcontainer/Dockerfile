# https://github.com/microsoft/vscode-dev-containers/blob/main/containers/deno/.devcontainer/Dockerfile

FROM mcr.microsoft.com/vscode/devcontainers/javascript-node

ENV DENO_INSTALL=/deno
RUN mkdir -p /deno \
    && curl -fsSL https://deno.land/x/install/install.sh | sh \
    && chown -R node /deno

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno
