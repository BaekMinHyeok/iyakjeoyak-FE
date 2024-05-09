import { useNavigate } from "react-router-dom";
import {
	SignUpFormType,
	signUpDefault,
	signupValidation,
} from "@/pages/pastsignup/utils/signupValidation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import postSignUp from "@/api/user/postSignUp";
import { ControlForm } from "@/components/ControlForm";
import { useForm, useWatch } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import {
	getDuplicationEmail,
	getDuplicationNickName,
} from "@/api/user/duplication";
import Container from "@/components/ControlForm/Container";
import commonQueryOptions from "@/api/common";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import styles from "../styles/SignUp.module.scss";

export function SignUp() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		formState: { errors },
		control,
	} = useForm<SignUpFormType>({
		mode: "onSubmit",
		resolver: yupResolver(signupValidation), // yup 스키마를 해결하는 resolver 설정
		defaultValues: signUpDefault,
	});
	const selectedTags = useWatch({ control, name: "userHashtagList" });

	const { mutate } = useMutation({
		mutationFn: postSignUp,
	});
	const { data: tags } = useQuery(commonQueryOptions.getHashtags());

	// 회원가입
	const onSubmit = (data: SignUpFormType) => {
		const { profileImage, ...jsonData } = data;

		const formData = new FormData();
		const userJoinPayload = {
			...jsonData,
			userRoleList: [1], // 백엔드에서 추가 요구하신 필드 값
		};
		// 회원가입 데이터
		formData.append(
			"userJoinPayload",
			new Blob([JSON.stringify(userJoinPayload)], { type: "application/json" }),
		);
		formData.append("imgFile", profileImage || "");

		mutate(formData, {
			onSuccess: () => {
				toast.success("회원가입이 완료되었습니다.", { autoClose: 2000 });
				navigate("/login");
			},
			onError: () => {
				toast.error("회원가입에 실패하였습니다.", { autoClose: 2000 });
			},
		});
	};

	// 이메일 중복검사
	const handleCheckUserName = async () => {
		const username = getValues("username");
		const response = await getDuplicationEmail({ username });
		if (response === false) {
			toast.success("사용 가능한 이메일 입니다.", { autoClose: 2000 });
		} else {
			toast.error("이미 사용 중인 이메일 입니다.", { autoClose: 2000 });
		}
	};
	// 닉네임 중복검사
	const handleCheckNickName = async () => {
		const nickname = getValues("nickname");
		const response = await getDuplicationNickName({ nickname });
		if (response === false) {
			toast.success("사용 가능한 닉네임 입니다."), { autoClose: 2000 };
		} else {
			toast.error("이미 사용 중인 닉네임 입니다.", { autoClose: 2000 });
		}
	};

	return (
		<ControlForm onSubmit={handleSubmit(onSubmit)}>
			<ControlForm.ImgInput
				setProfileImageData={(file) => setValue("profileImage", file)}
				{...register("profileImage")}
			/>
			<div className={styles.checkWrap}>
				<div className={styles.checkFlex}>
					<ControlForm.Input
						title="이메일"
						placeholder="이메일을 입력해주세요."
						{...register("username")}
						className={errors.username ? styles.error : ""}
					/>

					<ControlForm.Button
						onClick={handleCheckUserName}
						text="이메일 중복확인"
						type="button"
						variant="dark"
					/>
				</div>
				<ErrorMessage
					errors={errors}
					name="username"
					render={({ message }) => <p>{message}</p>}
				/>
			</div>
			<div>
				<ControlForm.Input
					title="비밀번호"
					placeholder="비밀번호를 입력해주세요."
					type="password"
					{...register("password")}
					className={errors.username ? styles.error : ""}
				/>
				<ErrorMessage
					errors={errors}
					name="password"
					render={({ message }) => <p>{message}</p>}
				/>
			</div>
			<div>
				<ControlForm.Input
					title="비밀번호 확인"
					placeholder="비밀번호를 입력해주세요."
					type="password"
					{...register("confirmPassword")}
					className={errors.username ? styles.error : ""}
				/>
				<ErrorMessage
					errors={errors}
					name="confirmPassword"
					render={({ message }) => <p>{message}</p>}
				/>
			</div>

			<div className={styles.checkWrap}>
				<div className={styles.checkFlex}>
					<ControlForm.Input
						title="닉네임"
						placeholder="닉네임을 입력해주세요."
						{...register("nickname")}
						className={errors.username ? styles.error : ""}
					/>
					<ControlForm.Button
						onClick={handleCheckNickName}
						text=" 중복확인"
						type="button"
						variant="dark"
						className={errors.username ? styles.error : ""}
					/>
				</div>

				<ErrorMessage
					errors={errors}
					name="nickname"
					render={({ message }) => <p>{message}</p>}
				/>
			</div>

			<Container title="성별">
				<div className={`${styles.genderBox}`}>
					<ControlForm.RadioButton
						text="남성"
						value="MALE"
						{...register("gender")}
					/>
					<ControlForm.RadioButton
						text="여성"
						value="FEMALE"
						{...register("gender")}
					/>
					<ControlForm.RadioButton
						text="비공개"
						value="SECRET"
						{...register("gender")}
					/>
				</div>
				<ErrorMessage
					errors={errors}
					name="gender"
					render={({ message }) => <p>{message}</p>}
				/>
			</Container>
			<div>
				<ControlForm.Input
					title="만 나이"
					placeholder="나이를 입력해주세요."
					type="number"
					{...register("age")}
					className={errors.username ? styles.error : ""}
				/>
				<ErrorMessage
					errors={errors}
					name="age"
					render={({ message }) => <p>{message}</p>}
				/>
			</div>
			<div>
				<ControlForm.TagBoard
					title="건강 고민"
					tags={tags}
					selectedTags={selectedTags}
					onTagClick={(selectedTag) => setValue("userHashtagList", selectedTag)}
					{...register("userHashtagList")}
				/>
				<ErrorMessage
					errors={errors}
					name="userHashtagList"
					render={({ message }) => <p>{message}</p>}
				/>
			</div>

			<ControlForm.Button text="확인" type="submit" variant="dark" />
			<DevTool control={control} />
		</ControlForm>
	);
}
