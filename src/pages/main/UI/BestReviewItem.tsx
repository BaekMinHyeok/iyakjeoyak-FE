import { BestReviewItemType } from "@/api/review/getBestReview";
import TagCommon from "@/components/Tag";
import styles from "../styles/BestReviewItem.module.scss";
import { useNavigate } from "react-router-dom";

export default function BestReviewItem({
	review,
}: {
	review: BestReviewItemType;
}) {
	const navigate = useNavigate();

	return (
		<div
			className={styles["container"]}
			onClick={() => {
				navigate(`/detail/${review.id}?tap=review`);
			}}
		>
			<img
				className={styles.img}
				src={
					review?.imageResult[0]?.fullPath ?? "https://picsum.photos/200/300"
				}
				alt={review.title}
			/>
			<div className={styles["content-container"]}>
				<div className={styles.name}>{review.medicine.prdlst_NM}</div>
				{review?.hashtagResult[0]?.name && (
					<TagCommon
						text={review.hashtagResult[0].name}
						size="medium"
						backgroundColor={"green"}
					/>
				)}
			</div>
		</div>
	);
}
