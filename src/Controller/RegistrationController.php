<?php

namespace App\Controller;

use App\Entity\Foto;
use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Security\UserAuthenticator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Guard\GuardAuthenticatorHandler;
use Symfony\Component\Filesystem\Filesystem;

class RegistrationController extends AbstractController
{
    /**
     * @Route("/register", name="app_register")
     */
    public function register(Request $request, UserPasswordEncoderInterface $passwordEncoder, GuardAuthenticatorHandler $guardHandler, UserAuthenticator $authenticator): Response
    {
        $userActivo =  $this->getUser();
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // encode the plain password
            $user->setPassword(
                $passwordEncoder->encodePassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );

            $foto = $form->get('foto')->getData();
            self::renamePic($user, $foto);
            $admin = 'ROLE_ADMIN';
            if (!is_null($userActivo)) {
                if (in_array($admin, $userActivo->getRoles())) {
                    return $this->redirectToRoute('user_index');
                } 
            }else {
                    return $guardHandler->authenticateUserAndHandleSuccess(
                        $user,
                        $request,
                        $authenticator,
                        'main' // firewall name in security.yaml
                    );
                }
            
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }

    /**
     * @Route("/registerAdmin", name="register_admin")
     */
    public function registerAdmin(Request $request, UserPasswordEncoderInterface $passwordEncoder, GuardAuthenticatorHandler $guardHandler, UserAuthenticator $authenticator): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // encode the plain password
            $user->setPassword(
                $passwordEncoder->encodePassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );
            $user->setRoles(array('ROLE_ADMIN'));
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($user);
            $entityManager->flush();

            $foto = $form->get('foto')->getData();
            self::renamePic($user, $foto);

            return $guardHandler->authenticateUserAndHandleSuccess(
                $user,
                $request,
                $authenticator,
                'main' // firewall name in security.yaml
            );
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }
    private function renamePic(User $user, $fotoFile)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        $foto = new Foto();
        $foto->setNombre($fotoFile->getClientOriginalName());
        $entityManager->persist($foto);
        $entityManager->flush();

        $idFoto = $foto->getId();
        $fileName = 'img' . $user->getId() . '-' . $idFoto . '.' . $fotoFile->guessExtension();

        $filesystem = new Filesystem();

        try {
            $filesystem->mkdir('users/user' . $user->getId());
        } catch (IOExceptionInterface $exception) {
            echo "An error occurred while creating your directory at " . $exception->getPath();
        }
        $fotoFile->move('users/user' . $user->getId(), $fileName);
        $foto->setNombre($fileName);
        $entityManager->flush();

        $user->addFoto($foto);
        $entityManager->flush();
    }
}
