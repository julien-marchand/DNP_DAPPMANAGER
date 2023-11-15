import React from "react";
import Card from "components/Card";
import { ZkevmItem, ZkevmItemOk } from "@dappnode/common";
import { prettyDnpName } from "utils/format";
import { joinCssClass } from "utils/css";
import defaultAvatar from "img/defaultAvatar.png";
import errorAvatar from "img/errorAvatarTrim.png";
import Button from "components/Button";
import { getInstallerPath } from "pages/installer";
import { useNavigate } from "react-router-dom";

export default function ZkevmModule({
  rollup,
  setNewRollup,
  isSelected,
  ...props
}: {
  rollup: ZkevmItem<"rollup">;
  setNewRollup: React.Dispatch<
    React.SetStateAction<ZkevmItemOk<"rollup"> | undefined>
  >;
  isSelected: boolean;
}) {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (rollup.status === "ok") {
      if (rollup.isInstalled) {
        if (rollup.isRunning) {
          // The package is installed and running, stop it
          setNewRollup(undefined);
        } else {
          // The package is installed but not running, start it
          setNewRollup(rollup);
        }
      } else {
        // The package is not installed, install and start it
        setNewRollup(rollup);
      }
    }
  };

  const handleUIRedirect = () => {
    window.location.href = "http://ui.zkevm-tokens-withdrawal.dappnode/";
  };

  return (
    <Card
      {...props}
      className={`optimism-node ${joinCssClass({ isSelected })}`}
      shadow={isSelected}
    >
      <div
        onClick={
          rollup.status === "ok"
            ? isSelected
              ? () => setNewRollup(undefined)
              : () => setNewRollup(rollup)
            : undefined
        }
      >
        {rollup.status === "ok" ? (
          <div className="avatar">
            <img src={rollup.avatarUrl || defaultAvatar} alt="avatar" />
          </div>
        ) : rollup.status === "error" ? (
          <div className="avatar">
            <img src={errorAvatar} alt="avatar" />
          </div>
        ) : null}

        <div className="title">{prettyDnpName(rollup.dnpName)}</div>
      </div>

      {rollup.status === "ok" &&
        isSelected &&
        rollup.isInstalled &&
        !rollup.isUpdated && (
          <>
            <Button
              onClick={() =>
                navigate(
                  `${getInstallerPath(rollup.dnpName)}/${rollup.dnpName}`
                )
              }
              variant="dappnode"
            >
              UPDATE
            </Button>
            <br />
            <br />
          </>
        )}

      {rollup.status === "ok" && (
        <div className="description">
          {isSelected && rollup.data && rollup.data.metadata.shortDescription}
        </div>
      )}

      <Button onClick={handleUIRedirect} variant="dappnode">
        Go to UI
      </Button>
    </Card>
  );
}
